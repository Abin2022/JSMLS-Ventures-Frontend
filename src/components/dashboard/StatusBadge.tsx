import type { AccountStatus } from "@/types";

const styles: Record<AccountStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
};

const labels: Record<AccountStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
};

export default function StatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}