import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-10">
      <h1 className="mb-2 text-[1.6rem] font-bold text-navy-900">Victory Club Dashboard</h1>
      <p className="text-muted">
        You are logged in. The dashboard sections are coming in the next phase.
      </p>
      <p className="mt-4 rounded-[10px] border border-yellow-300 bg-yellow-50 px-3.5 py-3 text-sm text-yellow-900">
        Illustrative interface only. No actual payment entitlement or income is represented.
      </p>
    </div>
  );
}