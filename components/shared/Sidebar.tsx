"use client";
import { cn } from "@/lib/utils";
import { HomeIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-6 w-15 sm:w-40 md:30">
      <Link
        href="/"
        className={cn("flex items-center gap-2 rounded-2xl p-2 sm:p-4", {
          "text-white bg-blue-1": pathname === "/",
          "text-blue-1": pathname !== "/",
        })}
      >
        <HomeIcon className="w-6 h-6" />
        <span className="hidden sm:block">Home</span>
      </Link>
      <Link
        href="/favourites"
        className={cn("flex items-center gap-2 rounded-2xl p-2 sm:p-4", {
          "text-white bg-blue-1": pathname === "/favourites",
          "text-blue-1": pathname !== "/favourites",
        })}
      >
        <StarIcon className="w-6 h-6" />
        <span className="hidden sm:block">Favourites</span>
      </Link>
    </div>
  );
}
