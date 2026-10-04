import type { Metadata } from "next";
import { LatestShort } from "@/components/home/latest-episode";
import { MemberGalleries } from "@/components/members/member-galleries";
import { SaveThisPage } from "@/components/members/save-this-page";
import { getLatestVideo } from "@/lib/latestVideo";

export const metadata: Metadata = {
  title: "Welcome to the Club!",
  robots: "noindex",
};

export default async function MembersPage() {
  const latestVideo = await getLatestVideo();

  return (
    <div className="px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-center text-5xl text-white sm:text-6xl">Welcome to the Club!</h1>
        <SaveThisPage />
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg font-bold text-white sm:text-xl">
          Thanks for joining! Everything here is free. Check back after each new episode for new
          pages.
        </p>

        <MemberGalleries />

        <section className="mt-16" aria-labelledby="episode-alerts">
          <h2 id="episode-alerts" className="text-center text-4xl text-white sm:text-5xl">
            New Episode Alerts
          </h2>
          <p className="mt-4 text-center text-lg font-bold text-white sm:text-xl">
            You&apos;ll get an email every time a new episode comes out,
          </p>
          {latestVideo ? (
            <div className="mt-8">
              <LatestShort video={latestVideo} />
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
