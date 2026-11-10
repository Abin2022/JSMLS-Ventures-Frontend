"use client";

import { useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { registerDemo } from "@/services/auth";
import { isEmail, isIndianMobile, passwordError } from "@/lib/validators";

type Field = "fullName" | "email" | "mobile" | "password" | "confirm" | "terms";
type Errors = Partial<Record<Field, string>>;

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function validate(): Errors {
    const e: Errors = {};
    if (fullName.trim().length < 3) e.fullName = "Enter your full name.";
    if (!isEmail(email)) e.email = "Enter a valid email address.";
    if (!isIndianMobile(mobile)) e.mobile = "Enter a valid 10-digit mobile number.";
    const pw = passwordError(password);
    if (pw) e.password = pw;
    if (confirm !== password) e.confirm = "Passwords do not match.";
    if (!terms) e.terms = "You must accept the terms and privacy policy.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setMessage(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const res = await registerDemo({
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.replace(/[\s-]/g, ""),
      password,
      acceptedTerms: terms,
    });
    setLoading(false);
    setMessage(res.message);
    setPassword("");
    setConfirm("");
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      <Input
        label="Full name"
        name="fullName"
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Mobile number"
        name="mobile"
        type="tel"
        autoComplete="tel"
        placeholder="10-digit number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        error={errors.mobile}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        hint="At least 8 characters with upper case, lower case and a number."
      />
      <Input
        label="Confirm password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />

      <div className="grid gap-1.5">
  <label className="flex items-start gap-2.5 text-sm">
    <input
      type="checkbox"
      className="mt-1"
      checked={terms}
      onChange={(e) => setTerms(e.target.checked)}
    />
      <span>I accept the Terms and Privacy Policy.</span>
      </label>
       {errors.terms && <span className="text-sm text-red-600">{errors.terms}</span>}
     </div>

      {message && <Alert tone="success">{message}</Alert>}
      <Button type="submit" block disabled={loading}>
        {loading ? "Please wait…" : "Create account"}
      </Button>
    </form>
  );
}