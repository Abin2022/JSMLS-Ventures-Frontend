// The 4 roles from Section 3 of the PDF.
export type Role = "participant" | "administrator" | "finance_officer" | "super_admin";

export type LoginPayload = { identifier: string; password: string; otp?: string };

export type RegisterPayload = {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  acceptedTerms: boolean;
};

export type ServiceResult = { ok: boolean; message: string };