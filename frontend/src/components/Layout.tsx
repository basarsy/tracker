import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, ChevronDown, LogOut, Moon, Sun, User } from "lucide-react";
import { logout } from "../api/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { cn } from "../lib/utils";

function getInitialDark(): boolean {
  const saved = localStorage.getItem("jobtracker.theme");
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

export function Layout() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("jobtracker.theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-app text-main transition-colors duration-150">
      <header className="sticky top-0 z-40 border-b border-line dark:border-[#262C38] bg-surface/90 backdrop-blur-md transition-colors duration-150">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand & Segmented Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5BFF] dark:bg-[#6C86FF] text-white shadow-sm transition-transform group-hover:scale-105">
                <BriefcaseBusiness className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="font-semibold text-base tracking-tight text-main hidden sm:inline-block">
                JobTracker
              </span>
            </NavLink>

            {/* Soft pill-style Segmented Nav */}
            <nav className="inline-flex rounded-xl bg-subtle p-1 border border-line dark:border-[#262C38]">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-accent-soft text-accent font-semibold"
                      : "text-muted hover:text-main",
                  )
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-accent-soft text-accent font-semibold"
                      : "text-muted hover:text-main",
                  )
                }
              >
                Applications
              </NavLink>
            </nav>
          </div>

          {/* Right: Theme Toggle & User Menu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDark((prev) => !prev)}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-subtle hover:text-main transition-colors duration-150"
            >
              {dark ? (
                <Sun className="h-4 w-4 stroke-[2]" />
              ) : (
                <Moon className="h-4 w-4 stroke-[2]" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-subtle py-1.5 pl-2.5 pr-3 text-xs sm:text-sm font-medium text-main hover:bg-line/50 dark:hover:bg-subtle/80 transition-colors duration-150 focus:outline-none"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="hidden sm:inline">Admin</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 border border-line dark:border-[#262C38] bg-surface">
                <DropdownMenuLabel>admin@jobtracker.local</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} danger>
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
