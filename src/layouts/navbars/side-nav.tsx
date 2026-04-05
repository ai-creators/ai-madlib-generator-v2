"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { routerConfig } from "@/router-config";
import {
  Home,
  FilePen,
  LayoutGrid,
  Tag,
  Bookmark,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: routerConfig.home.path, icon: Home },
  { label: "Create", href: routerConfig.create.path, icon: FilePen },
  { label: "Browse", href: routerConfig.browse.path, icon: LayoutGrid },
  { label: "Categories", href: routerConfig.categories.path, icon: Tag },
  { label: "Saves", href: routerConfig.saves.path, icon: Bookmark },
];

const bottomNavItems = [
  { label: "Settings", href: routerConfig.settings.path, icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col lg:h-full">
      <nav className="flex flex-col gap-1 lg:flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Button
              key={href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "font-medium")}
              asChild
            >
              <Link href={href}>
                <Icon />
                {label}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="flex flex-col gap-1">
        {bottomNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Button
              key={href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "font-medium")}
              asChild
            >
              <Link href={href}>
                <Icon />
                {label}
              </Link>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
