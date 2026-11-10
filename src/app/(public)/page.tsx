import Link from "next/link";

const cards = [
  { title: "Your own account", text: "Every member gets a unique User ID that starts with VC, and a secure login." },
  { title: "One dashboard", text: "See your profile, account status, stage and level information in one place." },
  { title: "Clear records", text: "Keep track of your activity history and referral records in a transparent way." },
];

export default function Home() {
  return (
    <>
      <section className="bg-linear-to-br from-navy-900 to-navy-700 py-20 text-white">
        <div className="mx-auto w-full max-w-6xl px-5">
          <h1 className="mb-3 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight">
            Welcome to Victory Club
          </h1>
          <p className="max-w-[52ch] text-lg text-[#d6dcf2]">
            Register, get your unique User ID and follow your progress through the levels and
            stages. This is a demonstration version with sample data only.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-[10px] bg-gold-500 px-5 py-2.5 font-semibold text-black hover:bg-gold-600">
              Register
            </Link>
            <Link href="/login" className="rounded-[10px] border border-white/40 px-5 py-2.5 font-semibold text-white hover:border-white">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-14">
        <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.title} className="rounded-xl border border-line bg-white p-6 shadow-lg shadow-navy-900/10">
              <h3 className="mb-2 text-[1.1rem] font-semibold text-navy-900">{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}