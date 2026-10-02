import type { Metadata } from "next";
import { OwnerLogin } from "@/components/owner/owner-login";
import { isOwner } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OwnerPage() {
  const loggedIn = await isOwner();

  return (
    <div className="px-4 py-10 sm:py-14">
      <OwnerLogin loggedIn={loggedIn} />
    </div>
  );
}
