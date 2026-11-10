"use client";

import Link from "next/link";
import { useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginDemo } from "@/services/auth";
import { isEmail, isUserId } from "@/lib/validators";

type Errors = Partial<Record<"identifier" | "password" | "otp", string>>;

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function validate(): Errors {
    const e: Errors = {};
    if (!identifier.trim()) e.identifier = "Enter your User ID or email.";
    else if (!isUserId(identifier) && !isEmail(identifier))
      e.identifier = "Use a User ID like VC100001 or a valid email.";
    if (!password) e.password = "Enter your password.";
    if (otp && !/^\d{6}$/.test(otp)) e.otp = "The OTP is 6 digits.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setMessage(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const res = await loginDemo({ identifier: identifier.trim(), password, otp: otp || undefined });
    setLoading(false);
    setMessage(res.message);
    setPassword("");
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      <Input
        label="User ID or email"
        name="identifier"
        autoComplete="username"
        placeholder="VC100001 or you@example.com"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={errors.identifier}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Input
        label="OTP (only if requested)"
        name="otp"
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        error={errors.otp}
        hint="Leave empty unless you are asked for an OTP."
      />
      <div className="flex justify-end text-sm">
      <Link href="/login" className="text-navy-600 hover:underline">Forgot password?</Link>
      </div>
      {message && <Alert tone="info">{message}</Alert>}
      <Button type="submit" block disabled={loading}>
        {loading ? "Please wait…" : "Login"}
      </Button>
    </form>
  );
}