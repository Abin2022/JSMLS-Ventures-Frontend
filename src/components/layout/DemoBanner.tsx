import { DEMO_NOTICE } from "@/lib/constants";

export default function DemoBanner() {
  return (
    <div role="note" className="border-b border-yellow-300 bg-yellow-50 text-sm text-yellow-900">
      <div className="mx-auto flex w-full max-w-6xl items-baseline gap-2.5 px-5 py-2">
        <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[0.7rem] font-bold tracking-wider text-black">
          DEMO
        </span>
        <span>{DEMO_NOTICE}</span>
      </div>
    </div>
  );
}