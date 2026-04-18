import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = ({ collapsed }: { collapsed?: boolean }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={cn(
    "h-12 opacity-50 rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 animate-pulse",
    collapsed ? "w-12" : "w-full"
  )}></div>;

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className={cn(
        "h-12 flex items-center rounded-xl shadow-sm bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300",
        collapsed ? "w-12 justify-center px-0" : "w-full px-4 gap-3"
      )}
      title={collapsed ? (currentTheme === "dark" ? "Light Mode" : "Dark Mode") : ""}
    >
      <div className="w-8 h-8 flex items-center justify-center relative shrink-0">
        {currentTheme === "dark" ? (
          <Sun className="text-yellow-400 fill-yellow-400" size={20} />
        ) : (
          <Moon className="text-slate-600 fill-slate-200" size={20} />
        )}
      </div>
      {!collapsed && (
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
          {currentTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
        </span>
      )}
    </button>
  );
};
