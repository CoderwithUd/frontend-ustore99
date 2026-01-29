"use client";

import Link from "next/link";
import { SidebarNav } from "@/components/shell/SidebarNav";
import { Topbar } from "@/components/shell/Topbar";
import { useAppSelector } from "@/store/hooks";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const role = useAppSelector((s) => s.auth.role);

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          <div className="flex h-14 items-center px-4">
            <Link href="/admin/overview" className="text-sm font-semibold tracking-tight text-slate-900">
              Ustore99 <span className="text-brand-600">Admin</span>
            </Link>
          </div>
          <div className="px-3 py-4">
            <SidebarNav role={role} />
          </div>
        </aside>
        <main className="min-w-0">
          <Topbar />
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

