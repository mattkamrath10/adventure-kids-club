import { publicFileExists } from "@/lib/public-images";
import { HeaderClient } from "./header-client";

export function Header() {
  const logo = publicFileExists("/images/logo.png") ? "/images/logo.png" : null;
  return <HeaderClient logo={logo} />;
}
