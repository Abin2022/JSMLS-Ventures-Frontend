
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { fullName, email, mobile, password } = body;

    // 1. Validate required fields
    if (!fullName || !email || !mobile || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // 2. Validate input types
    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof mobile !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input format" },
        { status: 400 }
      );
    }

    // 3. Clean input values
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    let cleanMobile = mobile.replace(/[\s()-]/g, "");

    if (cleanMobile.startsWith("+91")) {
      cleanMobile = cleanMobile.substring(3);
    }

    // 4. Validate full name
    if (cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { success: false, message: "Name must contain 2 to 100 characters" },
        { status: 400 }
      );
    }

    // 5. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // 6. Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    // 7. Validate password
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least 8 characters",
        },
        { status: 400 }
      );
    }

    // 8. Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    // 9. Check duplicate mobile number
    const existingMobile = await prisma.user.findUnique({
      where: { mobile: cleanMobile },
    });

    if (existingMobile) {
      return NextResponse.json(
        { success: false, message: "Mobile number is already registered" },
        { status: 409 }
      );
    }

    // 10. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 11. Generate unique user ID and create user
    const newUser = await prisma.$transaction(async (tx) => {
      const result = await tx.$queryRaw<{ next_id: bigint }[]>`
        SELECT nextval('"vc_user_id_seq"') AS next_id
      `;

      const userId =
        "VC" + result[0].next_id.toString().padStart(6, "0");

      return tx.user.create({
        data: {
          userId,
          fullName: cleanName,
          email: cleanEmail,
          mobile: cleanMobile,
          passwordHash,
          // Role defaults to PARTICIPANT.
          // isVerified defaults to false.
        },
        select: {
          id: true,
          userId: true,
          fullName: true,
          email: true,
          mobile: true,
          role: true,
          isVerified: true,
          createdAt: true,
        },
      });
    });

    // 12. Send success response
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);

    // Handle database unique constraint errors
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email or mobile number is already registered",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
