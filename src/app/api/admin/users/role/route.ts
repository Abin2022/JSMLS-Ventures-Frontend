

import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { authenticate } from "../../../../../lib/auth";

const allowedRoles = [
  "PARTICIPANT",
  "ADMIN",
  "FINANCE_OFFICER",
  "SUPER_ADMIN",
] as const;

export async function PATCH(request: Request) {
  try {
    // 1. Authenticate the requesting user
    const authUser = authenticate(request);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // 2. Check whether the requesting user is a SUPER_ADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Super Admin permission required.",
        },
        { status: 403 }
      );
    }

    // 3. Read the request body
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Valid User ID is required",
        },
        { status: 400 }
      );
    }

    // 4. Validate the requested role
    if (
      typeof role !== "string" ||
      !(allowedRoles as readonly string[]).includes(role)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user role",
        },
        { status: 400 }
      );
    }

    // Convert the validated role into the allowed role type
    const newRole = role as (typeof allowedRoles)[number];

    // 5. Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 6. Prevent users from changing their own role
    if (targetUser.id === authUser.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot change your own role",
        },
        { status: 400 }
      );
    }

    // 7. Update the user's role
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        role: newRole,
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    // 8. Return success response
    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Role update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update user role",
      },
      { status: 500 }
    );
  }
}

