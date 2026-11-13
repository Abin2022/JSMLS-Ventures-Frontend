import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="grid place-items-center px-5 pt-10">
      <div className="w-full max-w-[460px] rounded-2xl border border-line bg-white px-6 py-8 shadow-lg shadow-navy-900/10 sm:px-7">
        <h1 className="mb-2 text-[1.6rem] font-bold leading-tight text-navy-900">Create your account</h1>
        <p className="mb-6 text-muted">
          We only ask for what is necessary. This is a demo demonstration, so no data will be saved...
        </p>
        <RegisterForm />
        <p className="mt-5 text-center text-[0.95rem] text-muted">
          Already registered?{" "}
          <Link href="/login" className="text-navy-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}