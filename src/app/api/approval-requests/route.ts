import { db } from "@/db";
import {
  approvalRequest,
  approvalAction,
  approvalRule,
  approvalRuleApprover,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET all approval requests
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get requests where user is the requester or an approver
    const requests = await db
      .select({
        id: approvalRequest.id,
        ruleId: approvalRequest.approvalRuleId,
        ruleName: approvalRule.ruleName,
        requestedById: approvalRequest.requestedByUserId,
        requestedByName: user.name,
        status: approvalRequest.status,
        createdAt: approvalRequest.createdAt,
        updatedAt: approvalRequest.updatedAt,
      })
      .from(approvalRequest)
      .leftJoin(
        approvalRule,
        eq(approvalRequest.approvalRuleId, approvalRule.id)
      )
      .leftJoin(user, eq(approvalRequest.requestedByUserId, user.id));

    // Get actions for each request
    const requestsWithActions = await Promise.all(
      requests.map(async (request) => {
        const actions = await db
          .select({
            id: approvalAction.id,
            approverId: approvalAction.approverUserId,
            approverName: user.name,
            action: approvalAction.action,
            notes: approvalAction.notes,
            createdAt: approvalAction.createdAt,
          })
          .from(approvalAction)
          .leftJoin(user, eq(approvalAction.approverUserId, user.id))
          .where(eq(approvalAction.approvalRequestId, request.id));

        return {
          ...request,
          actions,
        };
      })
    );

    return NextResponse.json({ requests: requestsWithActions });
  } catch (error) {
    console.error("Error fetching approval requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch approval requests" },
      { status: 500 }
    );
  }
}

// POST create new approval request
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { approvalRuleId } = body;

    if (!approvalRuleId) {
      return NextResponse.json(
        { error: "Approval rule ID is required" },
        { status: 400 }
      );
    }

    // Get the rule and its approvers
    const [rule] = await db
      .select()
      .from(approvalRule)
      .where(eq(approvalRule.id, approvalRuleId));

    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    const approvers = await db
      .select()
      .from(approvalRuleApprover)
      .where(eq(approvalRuleApprover.approvalRuleId, approvalRuleId))
      .orderBy(approvalRuleApprover.sequenceOrder);

    // Create request
    const [newRequest] = await db
      .insert(approvalRequest)
      .values({
        id: crypto.randomUUID(),
        approvalRuleId,
        requestedByUserId: session.user.id,
        status: "pending",
      })
      .returning();

    // Create pending actions for all approvers
    const actionRecords = approvers.map((approver) => ({
      id: crypto.randomUUID(),
      approvalRequestId: newRequest.id,
      approverUserId: approver.approverUserId,
      action: "pending",
    }));

    await db.insert(approvalAction).values(actionRecords);

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating approval request:", error);
    return NextResponse.json(
      { error: "Failed to create approval request" },
      { status: 500 }
    );
  }
}
