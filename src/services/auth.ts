import type { LoginPayload, RegisterPayload, ServiceResult } from "@/types";

// Used later when the Django REST API is connected.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function loginDemo(_payload: LoginPayload): Promise<ServiceResult> {
  await wait(600);
  return { ok: true, message: "Demo mode: the form works, but no backend is connected yet. Nothing was sent." };
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