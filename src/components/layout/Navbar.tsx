"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900 text-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link href="/" onClick={close} aria-label={`${SITE.name} home`} className="inline-flex items-center gap-2.5 text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-navy-700 text-[0.95rem] font-extrabold text-gold-500">
            VC
          </span>
          <span>{SITE.name}</span>
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
          className="h-10 w-10 cursor-pointer rounded-lg border border-white/30 text-xl md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>

        <nav aria-label="Primary">
          <ul
            id="primary-nav"
            className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-16 flex-col gap-1 border-t border-white/10 bg-navy-900 px-5 pb-5 pt-3 md:static md:flex md:flex-row md:items-center md:gap-1.5 md:border-0 md:bg-transparent md:p-0`}
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3.5 py-2 font-medium hover:bg-white/10 hover:text-white ${
                      active ? "bg-white/15 text-white" : "text-[#d6dcf2]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-1.5 md:ml-1.5 md:mt-0">
              <Link
                href="/register"
                onClick={close}
                className="block rounded-[10px] bg-gold-500 px-5 py-2.5 text-center font-semibold text-black hover:bg-gold-600"
              >
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}