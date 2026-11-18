
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { authenticate } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    // 1. Verify user authentication
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

    // 2. Allow only participants
    if (authUser.role !== "PARTICIPANT") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Participant permission required.",
        },
        { status: 403 }
      );
    }

    // 3. Fetch logged-in participant's profile
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        isApproved: true,
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

    // 4. Prepare dashboard data
    const dashboardData = {
      user: {
        userId: user.userId,
        name: user.fullName,
        email: user.email,
      },

      accountStatus: user.isApproved ? "ACTIVE" : "INACTIVE",

      // Sample data for the current demo
      currentStage: "Stage 1",

      // Total levels specified in the task
      levels: {
        totalLevels: 3,
      },
    };

    // 5. Return dashboard response
    return NextResponse.json({
      success: true,
      message: "Dashboard data retrieved successfully",
      ...dashboardData,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve dashboard data",
      },
      { status: 500 }
    );
  }
}
