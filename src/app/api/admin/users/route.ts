
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authenticate } from "../../../../lib/auth";

export async function GET(request: Request) {
  try {
    // Authenticate the user
    const authUser = authenticate(request);

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // Check the current role from the database
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

    // Retrieve all users
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve users" },
      { status: 500 }
    );
  }
}
