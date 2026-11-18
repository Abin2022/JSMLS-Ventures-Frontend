
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  try {
    // 1. Receive email and OTP
    const body = await request.json().catch(() => null);

    const { email, otp } = body || {};

    // 2. Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required",
        },
        { status: 400 }
      );
    }

    // 3. Validate input formats
    if (
      typeof email !== "string" ||
      typeof otp !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input format",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP must contain exactly 6 digits",
        },
        { status: 400 }
      );
    }

    // 4. Find registered user
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No registered account found",
        },
        { status: 404 }
      );
    }

    // 5. Check whether already verified
    if (user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already verified",
        },
        { status: 400 }
      );
    }

    // 6. Find stored OTP
    const otpRecord = await prisma.otpVerification.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "No OTP found. Please request a new OTP",
        },
        { status: 400 }
      );
    }

    // 7. Check OTP expiry
    const now = new Date();

    if (otpRecord.expiresAt <= now) {
      await prisma.otpVerification.deleteMany({
        where: {
          userId: user.id,
          otpHash: otpRecord.otpHash,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new OTP",
        },
        { status: 400 }
      );
    }

    // 8. Compare submitted OTP with stored hash
    const isOtpValid = await bcrypt.compare(
      otp,
      otpRecord.otpHash
    );

    if (!isOtpValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    // 9. Delete OTP and verify user in one transaction
    const verified = await prisma.$transaction(async (tx) => {
      // Delete only if this OTP is still current and unexpired.
      const deletedOtp = await tx.otpVerification.deleteMany({
        where: {
          userId: user.id,
          otpHash: otpRecord.otpHash,
          expiresAt: {
            gt: now,
          },
        },
      });

      // Prevent reuse or concurrent verification.
      if (deletedOtp.count !== 1) {
        return false;
      }

      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
      });

      return true;
    });

    if (!verified) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP is expired or already used. Please request a new OTP",
        },
        { status: 400 }
      );
    }

    // 10. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        user: {
          userId: user.userId,
          email: user.email,
          isVerified: true,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
