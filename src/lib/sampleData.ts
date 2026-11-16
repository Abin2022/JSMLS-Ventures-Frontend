import type { AccountStatus } from "@/types";

// Sample data only,  needed to replace with the logged-in user's real data when the backend is connected.
export const SAMPLE_USER: {
  fullName: string;
  userId: string;
  status: AccountStatus;
  stage: string;
  totalLevels: number;
} = {
  fullName: "Demo Participant",
  userId: "VC100001",
  status: "active",
  stage: "Stage 1",
  totalLevels: 3,
};