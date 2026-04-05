import { Button } from "@/components/ui/button";
import { routerConfig } from "@/router-config";
import { ModeToggle } from "@/theme/mode-toggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex border-b">
      <div className="container mx-auto flex items-center gap-3 p-3">
        <Link href="/">
          <span className="text-sm font-semibold tracking-tight uppercase sm:text-base md:text-xl">AI MadLibs</span>
        </Link>
        <ul className="ml-auto flex items-center gap-3">
          <li>
            <Button variant="default" size="lg" asChild>
              <Link href={routerConfig.create.path}>Create Adlib</Link>
            </Button>
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
