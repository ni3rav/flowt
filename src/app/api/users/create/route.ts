import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable, account, member } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 }
      );
    }

    // Check permissions
    const userMembers = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.userId, session.user.id),
          eq(member.organizationId, organizationId)
        )
      )
      .limit(1);

    const userMember = userMembers[0];

    if (!userMember || userMember.role === "member") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role, managerId } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role (only member or manager)
    if (role !== "member" && role !== "manager") {
      return NextResponse.json(
        { error: "Invalid role. Only 'member' or 'manager' allowed" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Create user using better-auth
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!signUpResult || !signUpResult.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    const newUserId = signUpResult.user.id;

    // Add user as member to organization
    const newMember = await db
      .insert(member)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        userId: newUserId,
        role,
        managerId: managerId || null,
        createdAt: new Date(),
        isManagerApprover: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      user: signUpResult.user,
      member: newMember[0],
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
