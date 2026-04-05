import { Button } from "@/components/ui/button";
import { routerConfig } from "@/router-config";
import { auth, signOut } from "@/server/auth";
import { ModeToggle } from "@/theme/mode-toggle";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();
  const isAuthenticated = !!session;
  return (
    <nav className="flex border-b">
      <div className="container mx-auto flex items-center gap-3 p-3">
        <Link href="/">
          <span className="text-sm font-semibold tracking-tight uppercase sm:text-base md:text-xl">
            AI MadLibs
          </span>
        </Link>

        <ul className="ml-auto flex items-center gap-3">
          <li>
            <Button variant="default" size="lg" asChild>
              <Link href={routerConfig.create.path}>Create Adlib</Link>
            </Button>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button variant="ghost" size="lg" type="submit">
                    Log Out
                  </Button>
                </form>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button variant="ghost" size="lg" asChild>
                  <Link href={routerConfig.logIn.path}>Sign In</Link>
                </Button>
              </li>
            </>
          )}
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
