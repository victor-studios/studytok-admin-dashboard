"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content", href: "/content", icon: BookOpen },
  { name: "Students", href: "/students", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-lg transform-gpu">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          StudyTok Admin
        </div>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-center text-sm font-bold shadow-lg">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin User</span>
              <span className="text-xs text-slate-400">Superadmin</span>
            </div>
          </div>
          <button 
            onClick={async () => {
              const { createClient } = await import('@supabase/supabase-js');
              const supabase = createClient(
                 process.env.NEXT_PUBLIC_SUPABASE_URL!, 
                 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
              );
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 bg-rose-500/10 rounded-md"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
