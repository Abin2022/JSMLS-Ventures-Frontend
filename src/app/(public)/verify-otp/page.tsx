import type { Metadata } from "next";
import Link from "next/link";
import OtpForm from "@/components/auth/OtpForm";

export const metadata: Metadata = { title: "Verify OTP" };

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}***@${domain}`;
}

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const valid = !!email && email.includes("@");

  return (
    <div className="grid place-items-center px-5 pt-10">
      <div className="w-full max-w-[460px] rounded-2xl border border-line bg-white px-6 py-8 shadow-lg shadow-navy-900/10 sm:px-7">
        <h1 className="mb-2 text-[1.6rem] font-bold leading-tight text-navy-900">Verify your OTP</h1>
        {valid ? (
          <>
            <p className="mb-5 text-muted">
              Enter the 6-digit code sent to <strong>{maskEmail(email)}</strong>.
            </p>
            <OtpForm email={email} />
          </>
        ) : (
          <p className="mb-2 text-muted">
            We couldn&apos;t find the email to verify. Please{" "}
            <Link href="/register" className="text-navy-600 hover:underline">register</Link> or{" "}
            <Link href="/login" className="text-navy-600 hover:underline">login</Link> first.
          </p>
        )}
        <p className="mt-5 text-center text-[0.95rem] text-muted">
          <Link href="/register" className="text-navy-600 hover:underline">← Back to register</Link>
        </p>
      </div>
    </div>
  );
}