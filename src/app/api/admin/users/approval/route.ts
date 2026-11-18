
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { authenticate } from "../../../../../lib/auth";

export async function PATCH(request: Request) {
  try {
    // 1. Authenticate the admin
    const authUser = authenticate(request);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login first.",
        },
        { status: 401 }
      );
    }

    // 2. Check admin role from database
    const currentUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { role: true },
    });

    if (
      !currentUser ||
      !["ADMIN", "SUPER_ADMIN"].includes(currentUser.role)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin permission required.",
        },
        { status: 403 }
      );
    }

    // 3. Read request body
    const body = await request.json();
    const { userId, isApproved } = body;

    // 4. Validate User ID
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Valid User ID is required",
        },
        { status: 400 }
      );
    }

    // 5. Validate approval status
    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "isApproved must be true or false",
        },
        { status: 400 }
      );
    }

    // 6. Find participant
    const participant = await prisma.user.findUnique({
      where: { userId },
    });

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (participant.role !== "PARTICIPANT") {
      return NextResponse.json(
        {
          success: false,
          message: "Only participants can be approved",
        },
        { status: 400 }
      );
    }

    // 7. Update approval status
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { isApproved },
      select: {
        userId: true,
        fullName: true,
        email: true,
        isApproved: true,
      },
    });

    // 8. Return response
    return NextResponse.json({
      success: true,
      message: isApproved
        ? "Participant approved successfully"
        : "Participant deactivated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Participant approval error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update participant approval status",
      },
      { status: 500 }
    );
  }
}
