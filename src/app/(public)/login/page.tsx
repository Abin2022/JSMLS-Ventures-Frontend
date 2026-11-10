import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="grid place-items-center px-5 pt-10">
      <div className="w-full max-w-[460px] rounded-2xl border border-line bg-white px-6 py-8 shadow-lg shadow-navy-900/10 sm:px-7">
        <h1 className="mb-2 text-[1.6rem] font-bold leading-tight text-navy-900">Login</h1>
        <p className="mb-6 text-muted">Use your User ID or email and your password.</p>
        <LoginForm />
        <p className="mt-5 text-center text-[0.95rem] text-muted">
          New here?{" "}
          <Link href="/register" className="text-navy-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}