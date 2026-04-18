import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const AppHeader = () => {
  return (
    <div className="sticky top-0 w-full z-40 px-4 py-4 pointer-events-none">
      <header className="pointer-events-auto flex justify-between items-center px-6 py-4 bg-white/70 dark:bg-[#020617]/60 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none rounded-2xl">
        <div className="flex items-center md:hidden">
          <Link href="/">
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">G.</h1>
          </Link>
        </div>
        <div className="hidden md:block"></div>{/* Balance flex */}

        <div className="flex gap-2 sm:gap-3 items-center">
          {/* ThemeToggle and Add Button moved to sidebar */}
        </div>
      </header>
    </div>
  );
};
