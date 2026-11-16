type Props = {
  label: string;
  value?: string;
  note?: string;
  children?: React.ReactNode;
};

export default function StatCard({ label, value, note, children }: Props) {
  return (
    <article className="rounded-xl border border-line bg-white p-5 shadow-lg shadow-navy-900/10">
      <p className="text-sm font-medium text-muted">{label}</p>
      {value && <p className="mt-1 text-2xl font-bold text-navy-900">{value}</p>}
      {children && <div className="mt-2">{children}</div>}
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </article>
  );
}