"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { HOME_BY_ROLE } from "@/lib/constants";
import { isEmail, isUserId } from "@/lib/validators";
import { loginUser } from "@/services/auth";

type Errors = Partial<Record<"identifier" | "password" | "otp", string>>;

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Redirect shortly after a successful login so the message can be read.
  useEffect(() => {
    if (!redirectTo) return;
    const t = setTimeout(() => router.push(redirectTo), 800);
    return () => clearTimeout(t);
  }, [redirectTo, router]);

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
    if (loading || redirectTo) return;

    setError(null);
    setSuccess(null);
    setNeedsVerify(false);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const res = await loginUser({
      identifier: identifier.trim(),
      password,
      otp: otp || undefined,
    });
    setLoading(false);

    if (res.ok) {
      setSuccess(`${res.message} Redirecting…`);
      setRedirectTo(HOME_BY_ROLE[res.user?.role ?? "participant"] ?? "/dashboard");
      return;
    }

    setError(res.message);
    setPassword(""); // never keep a failed password in the form
    setNeedsVerify(!!res.notVerified && isEmail(identifier));
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
      
      <div className="flex justify-end text-sm">
        <Link href="/forgot-password" className="text-navy-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {needsVerify && (
        <p className="text-sm">
          <Link
            href={`/verify-otp?email=${encodeURIComponent(identifier.trim())}`}
            className="font-semibold text-navy-600 hover:underline"
          >
            Verify your email now →
          </Link>
        </p>
      )}
      {success && <Alert tone="success">{success}</Alert>}

      <Button type="submit" block disabled={loading || !!redirectTo}>
        {loading ? "Logging in…" : "Login"}
      </Button>
    </form>
  );
}