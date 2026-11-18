
import { NextResponse } from "next/server";
import { authenticate, hasRole } from "../../../../lib/auth";

export async function GET(request: Request) {
  // Authenticate the user
  const user = authenticate(request);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please login first.",
      },
      { status: 401 }
    );
  }

  // Check user role
  if (!hasRole(user, ["ADMIN", "SUPER_ADMIN"])) {
    return NextResponse.json(
      {
        success: false,
        message: "Access denied. Admin permission required.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Welcome to the Admin API",
    user,
  });
}
