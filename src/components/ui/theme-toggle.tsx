"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  className?: string;
  variant?: "button" | "dropdown";
}

/**
 * Direct 1-click Theme Toggle Button with smooth rotation & scale animation
 */
export function ThemeToggle({
  className = "",
  variant = "button",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-accent/60 text-muted-foreground ${className}`}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    );
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-accent hover:bg-accent/80 text-foreground transition-all duration-200 ${className}`}
              aria-label="Select theme"
              title="Select theme"
            >
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className="flex items-center justify-between cursor-pointer font-medium text-xs"
          >
            <span className="flex items-center gap-2">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              Light
            </span>
            {theme === "light" && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className="flex items-center justify-between cursor-pointer font-medium text-xs"
          >
            <span className="flex items-center gap-2">
              <Moon className="h-3.5 w-3.5 text-blue-400" />
              Dark
            </span>
            {theme === "dark" && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className="flex items-center justify-between cursor-pointer font-medium text-xs"
          >
            <span className="flex items-center gap-2">
              <Monitor className="h-3.5 w-3.5 text-slate-500" />
              System
            </span>
            {theme === "system" && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 1-Click Toggle Button
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-accent hover:bg-accent/80 text-foreground transition-all duration-300 focus-visible:ring-1 focus-visible:ring-primary ${className}`}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

