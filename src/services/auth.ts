import type { LoginPayload, RegisterPayload, ServiceResult } from "@/types";

// Used later when the Next.js REST API is connected.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function loginDemo(_payload: LoginPayload): Promise<ServiceResult> {
  await wait(600);
  return { ok: true, message: "Demo mode: the form works, but no backend is connected yet or backend connectivity is not established. Nothing was sent." };
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


export async function verifyOtpDemo(code: string): Promise<ServiceResult> {
  await wait(600);
  if (code === "123456") {    // Demo OTP code for testing change this place later when the backend is connected.
    return { ok: true, message: "OTP verified (demo). Your account would now be activated." };
  }
  return { ok: false, message: "Incorrect OTP. Please check the code and try again." };
}

export async function resendOtpDemo(): Promise<ServiceResult> {
  await wait(600);
  return { ok: true, message: "A new OTP has been sent (demo: no real message is sent)." };
}


