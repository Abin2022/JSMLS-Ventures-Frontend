
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authenticate } from "../../../../lib/auth";
export async function GET(request: Request) {
  try {
    // 1. Check authentication
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

    // 2. Fetch logged-in user's details
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        mobile: true,
        isVerified: true,
        isApproved: true,
      },
    });

    // 3. Check whether user exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 4. Determine account status
    let accountStatus = "PENDING_VERIFICATION";

    if (user.isVerified && !user.isApproved) {
      accountStatus = "PENDING_APPROVAL";
    } else if (user.isVerified && user.isApproved) {
      accountStatus = "ACTIVE";
    }

    // 5. Return profile details
    return NextResponse.json(
      {
        success: true,
        message: "User profile retrieved successfully",
        data: {
          userId: user.userId,
          name: user.fullName,
          email: user.email,
          mobileNumber: user.mobile,
          accountStatus: accountStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve user profile",
      },
      { status: 500 }
    );
  }
}
