import type { Metadata } from "next";
import Link from "next/link";
import OtpForm from "@/components/auth/OtpForm";

export const metadata: Metadata = { title: "Verify OTP" };

export default function VerifyOtpPage() {
  return (
    <div className="grid place-items-center px-5 pt-10">
      <div className="w-full max-w-[460px] rounded-2xl border border-line bg-white px-6 py-8 shadow-lg shadow-navy-900/10 sm:px-7">
        <h1 className="mb-2 text-[1.6rem] font-bold leading-tight text-navy-900">Verify your OTP</h1>
        <p className="mb-4 text-muted">
          Enter the 6-digit code sent to your email or mobile number.
        </p>
        <div className="mb-5 rounded-[10px] border border-indigo-200 bg-indigo-50 px-3.5 py-3 text-sm text-navy-700">
          Demo mode: no real OTP is sent. Use <strong>123456</strong> to see the success message.
          Any other code shows the error message.
        </div>
        <OtpForm />
        <p className="mt-5 text-center text-[0.95rem] text-muted">
          <Link href="/login" className="text-navy-600 hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}