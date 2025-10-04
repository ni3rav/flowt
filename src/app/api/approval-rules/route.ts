import { db } from "@/db";
import { approvalRule, approvalRuleApprover, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET all approval rules for organization
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rules = await db
      .select({
        id: approvalRule.id,
        userId: approvalRule.userId,
        userName: user.name,
        userEmail: user.email,
        ruleName: approvalRule.ruleName,
        isSequential: approvalRule.isSequential,
        minimumApprovalPercentage: approvalRule.minimumApprovalPercentage,
        createdAt: approvalRule.createdAt,
        updatedAt: approvalRule.updatedAt,
      })
      .from(approvalRule)
      .leftJoin(user, eq(approvalRule.userId, user.id))
      .where(
        eq(approvalRule.organizationId, session.session.activeOrganizationId)
      );

    // Get approvers for each rule
    const rulesWithApprovers = await Promise.all(
      rules.map(async (rule) => {
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
          .where(eq(approvalRuleApprover.approvalRuleId, rule.id))
          .orderBy(approvalRuleApprover.sequenceOrder);

        return {
          ...rule,
          approvers,
        };
      })
    );

    return NextResponse.json({ rules: rulesWithApprovers });
  } catch (error) {
    console.error("Error fetching approval rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch approval rules" },
      { status: 500 }
    );
  }
}

// POST create new approval rule
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      userId,
      ruleName,
      isSequential,
      minimumApprovalPercentage,
      approvers, // Array of { userId, sequenceOrder? }
    } = body;

    // Validation
    if (!userId || !ruleName || !approvers || approvers.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      isSequential &&
      !approvers.every((a: any) => a.sequenceOrder !== undefined)
    ) {
      return NextResponse.json(
        { error: "Sequential rules require sequence order for all approvers" },
        { status: 400 }
      );
    }

    if (!isSequential && !minimumApprovalPercentage) {
      return NextResponse.json(
        { error: "Non-sequential rules require minimum approval percentage" },
        { status: 400 }
      );
    }

    // Create rule
    const [newRule] = await db
      .insert(approvalRule)
      .values({
        id: crypto.randomUUID(),
        userId,
        organizationId: session.session.activeOrganizationId,
        ruleName,
        isSequential: isSequential || false,
        minimumApprovalPercentage: isSequential
          ? null
          : minimumApprovalPercentage,
      })
      .returning();

    // Create approvers
    const approverRecords = approvers.map((approver: any) => ({
      id: crypto.randomUUID(),
      approvalRuleId: newRule.id,
      approverUserId: approver.userId,
      sequenceOrder: isSequential ? approver.sequenceOrder : null,
    }));

    await db.insert(approvalRuleApprover).values(approverRecords);

    return NextResponse.json({ rule: newRule }, { status: 201 });
  } catch (error) {
    console.error("Error creating approval rule:", error);
    return NextResponse.json(
      { error: "Failed to create approval rule" },
      { status: 500 }
    );
  }
}
