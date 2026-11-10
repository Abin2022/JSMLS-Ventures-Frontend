import Link from "next/link";
import { LEGAL_NOTICE, SITE } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 bg-navy-900 text-sm text-[#c6cde6]">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 pb-7 pt-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
        <div>
          <h3 className="mb-2 text-base font-semibold text-white">{SITE.name}</h3>
          <p className="mb-2">{SITE.tagline}</p>
          <p>Demonstration prototype · Version {SITE.version}</p>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Explore</h3>
          <ul className="grid gap-1.5">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/login" className="hover:underline">Login</Link></li>
            <li><Link href="/register" className="hover:underline">Register</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Company</h3>
          <ul className="grid gap-1.5">
            <li>{SITE.company}</li>
            <li>Terms &amp; Privacy Policy (coming soon)</li>
            <li>Support (coming soon)</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl border-t border-white/10 px-5 pb-6 pt-4 text-xs text-[#9ea8cc]">
        <p className="mb-2">Legal notice: {LEGAL_NOTICE}</p>
        <p>© {year} {SITE.company}. All rights reserved.</p>
      </div>
    </footer>
  );
}