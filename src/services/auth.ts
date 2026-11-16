import type { LoginPayload, RegisterPayload, ServiceResult, Role } from "@/types";
// Used later when the Next.js REST API is connected.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// /* eslint-disable @typescript-eslint/no-unused-vars */
// export async function loginDemo(_payload: LoginPayload): Promise<ServiceResult> {
//   await wait(600);
//   return { ok: true, message: "Demo mode: the form works, but no backend is connected yet or backend connectivity is not established. Nothing was sent." };
// }

const LOGIN_PATH = "/auth/login";

export type LoginUser = { userId?: string; fullName?: string; role?: Role };

export type LoginResult =
  | { ok: true; message: string; user?: LoginUser }
  | { ok: false; message: string; notVerified?: boolean };

export async function loginUser(payload: LoginPayload): Promise<LoginResult> {
  try {
    const { res, data } = await postJson(LOGIN_PATH, {
      identifier: payload.identifier, // User ID or email. Rename if the backend uses other field names.
      password: payload.password,
      ...(payload.otp ? { otp: payload.otp } : {}),
    });

    if (res.ok) {
      return { ok: true, message: data.message ?? "Login successful.", user: data.user };
    }
    if (res.status === 401) {
      // One message for every bad-credential case, so it never reveals which part was wrong.
      return { ok: false, message: "Invalid User ID/email or password." };
    }
    if (res.status === 403) {
      return {
        ok: false,
        message: data.message ?? "Your account is not verified or is not active.",
        notVerified: data.code === "EMAIL_NOT_VERIFIED",
      };
    }
    if (res.status === 429) {
      return { ok: false, message: data.message ?? "Too many login attempts. Please try again later." };
    }
    if (res.status === 400) {
      return { ok: false, message: data.message ?? "Please check your details and try again." };
    }
    return { ok: false, message: "Login failed. Please try again later." };
  } catch {
    return { ok: false, message: "Cannot reach the server. Check your connection and try again." };
  }
}






export async function registerDemo(_payload: RegisterPayload): Promise<ServiceResult> {
  await wait(600);
  return {
    ok: true,
    message:
      "Demo mode: your details passed the checks, but nothing was saved and no User ID was created. OTP verification and the User ID (VC100001 format) come with the backend.",
  };
}
/* eslint-enable @typescript-eslint/no-unused-vars */



const SEND_OTP_PATH = "/auth/send-otp";
const VERIFY_OTP_PATH = "/auth/verify-otp";

export type SendOtpResult =
  | { ok: true; message: string; expiresInSeconds: number; resendAfterSeconds: number }
  | { ok: false; message: string; retryAfterSeconds?: number };

export type VerifyOtpResult = { ok: boolean; message: string };

async function postJson(path: string, body: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export async function sendOtp(email: string): Promise<SendOtpResult> {
  try {
    const { res, data } = await postJson(SEND_OTP_PATH, { email });
    if (res.ok) {
      return {
        ok: true,
        message: data.message ?? "OTP sent to your email.",
        expiresInSeconds: data.expiresInSeconds ?? 300,
        resendAfterSeconds: data.resendAfterSeconds ?? 30,
      };
    }
    if (res.status === 429) {
      const retry = Number(res.headers.get("Retry-After")) || data.retryAfterSeconds || 60;
      return {
        ok: false,
        message: data.message ?? "Too many requests. Please try again later.",
        retryAfterSeconds: retry,
      };
    }
    if (res.status === 400) {
      return { ok: false, message: data.message ?? "Please check the email address and try again." };
    }
    return { ok: false, message: "Could not send the OTP. Please try again later." };
  } catch {
    return { ok: false, message: "Cannot reach the server. Check your connection and try again." };
  }
}

export async function verifyOtp(email: string, otp: string): Promise<VerifyOtpResult> {
  try {
    const { res, data } = await postJson(VERIFY_OTP_PATH, { email, otp });
    if (res.ok) {
      return { ok: true, message: data.message ?? "Email verified successfully." };
    }
    if (res.status === 429) {
      return { ok: false, message: data.message ?? "Too many attempts. Please wait and try again." };
    }
    // 400/401/410 etc.: wrong or expired OTP. Show the backend's own message.
    return { ok: false, message: data.message ?? "Incorrect or expired OTP. Please try again." };
  } catch {
    return { ok: false, message: "Cannot reach the server. Check your connection and try again." };
  }
}

