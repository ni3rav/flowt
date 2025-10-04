import { db } from "@/db";
import {
  approvalRequest,
  approvalAction,
  approvalRule,
  approvalRuleApprover,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// POST approve or reject a request
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, notes } = body; // action: 'approved' | 'rejected'

    if (!action || !["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Get the request
    const [request] = await db
      .select()
      .from(approvalRequest)
      .where(eq(approvalRequest.id, id));

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { error: "Request is already processed" },
        { status: 400 }
      );
    }

    // Get the rule
    const [rule] = await db
      .select()
      .from(approvalRule)
      .where(eq(approvalRule.id, request.approvalRuleId));

    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    // Find user's action record
    const [userAction] = await db
      .select()
      .from(approvalAction)
      .where(
        and(
          eq(approvalAction.approvalRequestId, id),
          eq(approvalAction.approverUserId, session.user.id)
        )
      );

    if (!userAction) {
      return NextResponse.json(
        { error: "You are not an approver for this request" },
        { status: 403 }
      );
    }

    if (userAction.action !== "pending") {
      return NextResponse.json(
        { error: "You have already processed this request" },
        { status: 400 }
      );
    }

    // Sequential approval logic
    if (rule.isSequential) {
      // Get all approvers in order
      const approvers = await db
        .select()
        .from(approvalRuleApprover)
        .where(eq(approvalRuleApprover.approvalRuleId, rule.id))
        .orderBy(approvalRuleApprover.sequenceOrder);

      // Get all actions
      const actions = await db
        .select()
        .from(approvalAction)
        .where(eq(approvalAction.approvalRequestId, id));

      // Find current user's sequence order
      const currentApprover = approvers.find(
        (a) => a.approverUserId === session.user.id
      );

      if (!currentApprover) {
        return NextResponse.json(
          { error: "Approver not found" },
          { status: 404 }
        );
      }

      // Check if all previous approvers have approved
      const previousApprovers = approvers.filter(
        (a) => (a.sequenceOrder || 0) < (currentApprover.sequenceOrder || 0)
      );

      for (const prevApprover of previousApprovers) {
        const prevAction = actions.find(
          (a) => a.approverUserId === prevApprover.approverUserId
        );
        if (!prevAction || prevAction.action !== "approved") {
          return NextResponse.json(
            { error: "Previous approvers have not approved yet" },
            { status: 400 }
          );
        }
      }

      // Update action
      await db
        .update(approvalAction)
        .set({ action, notes })
        .where(eq(approvalAction.id, userAction.id));

      // If rejected, reject the entire request
      if (action === "rejected") {
        await db
          .update(approvalRequest)
          .set({ status: "rejected" })
          .where(eq(approvalRequest.id, id));
      } else {
        // Check if this is the last approver
        const allActions = await db
          .select()
          .from(approvalAction)
          .where(eq(approvalAction.approvalRequestId, id));

        const allApproved = allActions.every((a) =>
          a.id === userAction.id
            ? action === "approved"
            : a.action === "approved"
        );

        if (allApproved) {
          await db
            .update(approvalRequest)
            .set({ status: "approved" })
            .where(eq(approvalRequest.id, id));
        }
      }
    } else {
      // Percentage-based approval
      await db
        .update(approvalAction)
        .set({ action, notes })
        .where(eq(approvalAction.id, userAction.id));

      // Get all actions
      const allActions = await db
        .select()
        .from(approvalAction)
        .where(eq(approvalAction.approvalRequestId, id));

      const totalApprovers = allActions.length;
      const approvedCount = allActions.filter((a) =>
        a.id === userAction.id ? action === "approved" : a.action === "approved"
      ).length;
      const rejectedCount = allActions.filter((a) =>
        a.id === userAction.id ? action === "rejected" : a.action === "rejected"
      ).length;

      const approvalPercentage = (approvedCount / totalApprovers) * 100;
      const requiredPercentage = rule.minimumApprovalPercentage || 100;

      // Check if we've reached the required percentage
      if (approvalPercentage >= requiredPercentage) {
        await db
          .update(approvalRequest)
          .set({ status: "approved" })
          .where(eq(approvalRequest.id, id));
      }
      // Check if it's impossible to reach required percentage
      else if (
        ((totalApprovers - rejectedCount) / totalApprovers) * 100 <
        requiredPercentage
      ) {
        await db
          .update(approvalRequest)
          .set({ status: "rejected" })
          .where(eq(approvalRequest.id, id));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing approval action:", error);
    return NextResponse.json(
      { error: "Failed to process approval action" },
      { status: 500 }
    );
  }
}
