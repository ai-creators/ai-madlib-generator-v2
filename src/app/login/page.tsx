import LoginForm from "@/auth/login-form";
import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/server/auth";
import { GalleryVerticalEnd } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          AI Madlibs
        </a>
        <LoginForm />
      </div>
    </main>
  );
}
