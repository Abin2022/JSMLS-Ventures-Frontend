"use client";

import { useId, useState } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  hint?: string;
};

export default function Input({ label, error, hint, type = "text", ...rest }: Props) {
  const id = useId();
  const msgId = `${id}-msg`;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? msgId : undefined}
          className={`w-full rounded-[10px] border bg-white px-3 py-2.5 text-ink focus:border-navy-600 focus:outline-2 focus:outline-offset-1 focus:outline-navy-600 ${
            error ? "border-red-600" : "border-line"
          } ${isPassword ? "pr-[4.5rem]" : ""}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 text-sm font-semibold text-navy-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error ? (
        <span id={msgId} className="text-sm text-red-600">{error}</span>
      ) : hint ? (
        <span id={msgId} className="text-[0.82rem] text-muted">{hint}</span>
      ) : null}
    </div>
  );
}