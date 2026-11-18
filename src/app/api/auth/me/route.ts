
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authenticate } from "../../../../lib/auth";

export async function GET(request: Request) {
  try {
    // Verify JWT token
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

    // Get current user from database
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        id: true,
        userId: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve user details",
      },
      { status: 500 }
    );
  }
}
