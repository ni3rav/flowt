import { db } from "@/db";
import { approvalRule, approvalRuleApprover, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET single approval rule
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rule] = await db
      .select()
      .from(approvalRule)
      .where(
        and(
          eq(approvalRule.id, id),
          eq(approvalRule.organizationId, session.session.activeOrganizationId)
        )
      );

    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    // Get approvers
    const approvers = await db
      .select({
        id: approvalRuleApprover.id,
        approverId: approvalRuleApprover.approverUserId,
        approverName: user.name,
        approverEmail: user.email,
        sequenceOrder: approvalRuleApprover.sequenceOrder,
      })
      .from(approvalRuleApprover)
      .leftJoin(user, eq(approvalRuleApprover.approverUserId, user.id))
      .where(eq(approvalRuleApprover.approvalRuleId, id))
      .orderBy(approvalRuleApprover.sequenceOrder);

    return NextResponse.json({ rule: { ...rule, approvers } });
  } catch (error) {
    console.error("Error fetching approval rule:", error);
    return NextResponse.json(
      { error: "Failed to fetch approval rule" },
      { status: 500 }
    );
  }
}

// DELETE approval rule
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(approvalRule)
      .where(
        and(
          eq(approvalRule.id, id),
          eq(approvalRule.organizationId, session.session.activeOrganizationId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting approval rule:", error);
    return NextResponse.json(
      { error: "Failed to delete approval rule" },
      { status: 500 }
    );
  }
}

// PATCH update approval rule
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ruleName, isSequential, minimumApprovalPercentage, approvers } =
      body;

    // Update rule
    const [updatedRule] = await db
      .update(approvalRule)
      .set({
        ruleName,
        isSequential,
        minimumApprovalPercentage: isSequential
          ? null
          : minimumApprovalPercentage,
      })
      .where(
        and(
          eq(approvalRule.id, id),
          eq(approvalRule.organizationId, session.session.activeOrganizationId)
        )
      )
      .returning();

    // Update approvers if provided
    if (approvers) {
      // Delete existing approvers
      await db
        .delete(approvalRuleApprover)
        .where(eq(approvalRuleApprover.approvalRuleId, id));

      // Insert new approvers
      const approverRecords = approvers.map((approver: any) => ({
        id: crypto.randomUUID(),
        approvalRuleId: id,
        approverUserId: approver.userId,
        sequenceOrder: isSequential ? approver.sequenceOrder : null,
      }));

      await db.insert(approvalRuleApprover).values(approverRecords);
    }

    return NextResponse.json({ rule: updatedRule });
  } catch (error) {
    console.error("Error updating approval rule:", error);
    return NextResponse.json(
      { error: "Failed to update approval rule" },
      { status: 500 }
    );
  }
}
