import Link from "next/link";

export function JoinBand() {
  return (
    <section className="px-4 py-12 sm:py-16" aria-labelledby="join-band">
      <div className="play-float mx-auto flex max-w-6xl flex-col items-center rounded-[2rem] bg-gradient-to-r from-gold via-orange to-pink px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 id="join-band" className="max-w-3xl text-4xl text-navy sm:text-6xl">
          Join the Adventure Kids Club
        </h2>
        <p className="mt-4 max-w-xl text-lg font-bold text-navy sm:text-2xl">
          News, games, and big adventures made for families.
        </p>
        <Link
          href="/join"
          className="mt-8 inline-flex min-h-14 items-center rounded-full bg-navy px-8 font-heading text-xl font-bold text-white hover:bg-white hover:text-navy"
        >
          Join the club
        </Link>
      </div>
    </section>
  );
}
