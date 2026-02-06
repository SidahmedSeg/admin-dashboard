"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useState, useRef, useEffect } from "react";
import { 
  ClipboardList, 
  LayoutGrid, 
  LogOut, 
  User, 
  Zap,
  TrendingUp,
  Activity
} from "lucide-react";

const TOKEN_KEY = "admin_token";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    router.push("/");
  };

  const navItems = [
    { href: "/deals", label: "Pending", icon: ClipboardList, color: "from-amber-500 to-orange-500" },
    { href: "/deals/all", label: "All Deals", icon: LayoutGrid, color: "from-indigo-500 to-purple-500" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    navItems.forEach(item => router.prefetch(item.href));
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-col border-r border-[#1f1f2e] bg-[#0f0f17] lg:flex animate-slide-in">
        {/* Logo section */}
        <div className="flex h-16 items-center gap-3 border-b border-[#1f1f2e] px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Admin</h1>
            <p className="text-[10px] text-gray-400 font-medium">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Deals Management
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                )}
                <Icon className={`relative z-10 h-4 w-4 transition-transform ${isActive ? "scale-110" : "group-hover:scale-105"}`} strokeWidth={2.5} />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <div className="relative z-10 ml-auto">
                    <Activity className="h-3 w-3 text-indigo-400 animate-pulse" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#1f1f2e] p-3">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:scale-105" strokeWidth={2.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#1f1f2e] bg-[#0f0f17] px-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
              <div>
                <h2 className="text-xs font-bold text-white">Real Estate Admin</h2>
                <p className="text-[10px] text-gray-500">Live monitoring</p>
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-[#1f1f2e] bg-[#14141f] px-3 py-1.5 sm:flex">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-white">98.2%</span>
              <span className="text-[10px] text-gray-500">uptime</span>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group flex items-center gap-2.5 rounded-lg border border-[#1f1f2e] bg-[#14141f] px-3 py-2 transition-all hover:border-indigo-500/30 hover:bg-[#1a1a28]"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#14141f]">
                    <User className="h-3.5 w-3.5 text-indigo-400" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="hidden text-xs font-bold text-white sm:block">Admin</span>
                <div className={`h-1.5 w-1.5 rounded-full bg-gray-500 transition-all ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-[#1f1f2e] bg-[#14141f] shadow-2xl animate-slide-up">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={2.5} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0f] p-6">{children}</main>
      </div>
    </div>
  );
}
