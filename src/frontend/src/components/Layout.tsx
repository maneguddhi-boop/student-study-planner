import type { Page } from "@/App";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  CheckSquare,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Timer,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userName: string;
  principal: string;
}

const NAV_ITEMS: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "subjects", label: "Subjects", icon: BookOpen },
  { page: "tasks", label: "Tasks", icon: CheckSquare },
  { page: "sessions", label: "Study Sessions", icon: Clock },
  { page: "notes", label: "Notes", icon: FileText },
  { page: "timer", label: "Pomodoro Timer", icon: Timer },
];

export function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  userName,
  principal,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside
          className="flex flex-col transition-all duration-300 ease-in-out"
          style={{
            width: sidebarOpen ? "240px" : "64px",
            background: "oklch(var(--sidebar))",
            borderRight: "1px solid oklch(var(--sidebar-border))",
            minWidth: sidebarOpen ? "240px" : "64px",
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center gap-3 px-4 py-5 border-b"
            style={{ borderColor: "oklch(var(--sidebar-border))" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(var(--sidebar-primary))" }}
            >
              <GraduationCap
                className="w-5 h-5"
                style={{ color: "oklch(var(--sidebar-primary-foreground))" }}
              />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display font-bold text-sm"
                style={{ color: "oklch(var(--sidebar-foreground))" }}
              >
                StudyPlanner
              </motion.span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 space-y-1 px-2">
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => {
              const active = currentPage === page;
              return (
                <Tooltip key={page} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      data-ocid={`nav.${page}.link`}
                      onClick={() => onNavigate(page)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left ${
                        active ? "text-white" : "hover:opacity-100 opacity-70"
                      }`}
                      style={{
                        background: active
                          ? "oklch(var(--sidebar-primary))"
                          : "transparent",
                        color: active
                          ? "white"
                          : "oklch(var(--sidebar-foreground))",
                      }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <motion.span
                          initial={false}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium truncate"
                        >
                          {label}
                        </motion.span>
                      )}
                      {active && sidebarOpen && (
                        <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right">{label}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* User section */}
          <div
            className="p-3 border-t"
            style={{ borderColor: "oklch(var(--sidebar-border))" }}
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-2.5">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback
                    className="text-xs font-bold"
                    style={{
                      background: "oklch(var(--sidebar-primary))",
                      color: "white",
                    }}
                  >
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "oklch(var(--sidebar-foreground))" }}
                  >
                    {userName}
                  </p>
                  <p
                    className="text-xs opacity-50 truncate"
                    style={{ color: "oklch(var(--sidebar-foreground))" }}
                  >
                    {principal.slice(0, 12)}…
                  </p>
                </div>
                <Button
                  data-ocid="nav.logout.button"
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="w-7 h-7 flex-shrink-0 opacity-60 hover:opacity-100"
                  style={{ color: "oklch(var(--sidebar-foreground))" }}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    data-ocid="nav.logout.button"
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="w-full h-9 opacity-60 hover:opacity-100"
                    style={{ color: "oklch(var(--sidebar-foreground))" }}
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center gap-3 px-6 py-3.5 bg-card border-b border-border">
            <Button
              data-ocid="nav.sidebar_toggle.button"
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen((v) => !v)}
              className="w-8 h-8"
            >
              {sidebarOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
            <h1 className="font-display font-semibold text-foreground capitalize">
              {NAV_ITEMS.find((n) => n.page === currentPage)?.label}
            </h1>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
