import type { Metadata } from "next";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { SAMPLE_USER } from "@/lib/sampleData";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const user = SAMPLE_USER;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.6rem] font-bold leading-tight text-navy-900">
            Welcome, {user.fullName}
          </h1>
          <p className="text-muted">Here is your Victory Club overview.</p>
        </div>
        <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-bold tracking-wider text-black">
          DEMO
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <StatCard label="User ID" value={user.userId} note="Your unique participant ID" />
        <StatCard label="Account Status">
          <StatusBadge status={user.status} />
        </StatCard>
        <StatCard label="Current Stage" value={user.stage} note="Demo mode (sample data)" />
        <StatCard
          label="Total Levels"
          value={`${user.totalLevels} Levels`}
          note="Level 1, Level 2 and Level 3"
        />
      </div>

      <p className="mt-6 rounded-[10px] border border-yellow-300 bg-yellow-50 px-3.5 py-3 text-sm text-yellow-900">
        Illustrative interface only. No actual payment entitlement or income is represented.
      </p>
    </>
  );
}