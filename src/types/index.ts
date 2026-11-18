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

export type AccountStatus = "active" | "inactive" | "suspended";

export type DashboardData = {
  fullName: string;
  userId: string;
  status: AccountStatus;
  stage: string;
  totalLevels: number;
};

export type ProfileData = {
  fullName: string;
  userId: string;
  email: string;
  mobile: string;
};



export type ServiceResult = { ok: boolean; message: string };