type Props = { tone?: "success" | "info" | "error"; children: React.ReactNode };

const tones = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-indigo-200 bg-indigo-50 text-navy-700",
  error: "border-red-200 bg-red-50 text-red-700",
};

export default function Alert({ tone = "info", children }: Props) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-[10px] border px-3.5 py-3 text-sm ${tones[tone]}`}
    >
      {children}
    </div>
  );
}