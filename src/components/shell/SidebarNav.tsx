"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, CreditCard, FileText, Settings, ShoppingBag, Users } from "lucide-react";
import type { Role } from "@/lib/constants";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/admin/overview", label: "Overview", icon: BarChart3, roles: ["super_admin", "seller"] as Role[] },
  { href: "/admin/products", label: "Products", icon: Boxes, roles: ["super_admin", "seller"] as Role[] },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, roles: ["super_admin"] as Role[] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["super_admin"] as Role[] },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, roles: ["super_admin"] as Role[] },
  { href: "/admin/reports", label: "Reports", icon: FileText, roles: ["super_admin"] as Role[] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["super_admin"] as Role[] }
];

export function SidebarNav({ role }: { role: Role | null }) {
  const pathname = usePathname();
  const items = role ? nav.filter((i) => i.roles.includes(role)) : nav.slice(0, 2);

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-50"
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-brand-700" : "text-slate-500")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
