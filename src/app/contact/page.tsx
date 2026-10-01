import { StarterHeading } from "@/components/starter-heading";
import { starterMetadata } from "@/lib/metadata";

export const metadata = starterMetadata("Contact", "/contact");

export default function ContactPage() {
  return <StarterHeading title="Contact" className="text-purple" />;
}
