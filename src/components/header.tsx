import { existsSync } from "node:fs";
import path from "node:path";
import { HeaderClient } from "./header-client";

export function Header() {
  const hasLogo = existsSync(
    path.join(process.cwd(), "public", "images", "logo.png"),
  );

  return <HeaderClient hasLogo={hasLogo} />;
}
