"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutAndReset } from "@/features/auth/authSlice";
import { formatRole } from "@/lib/constants";

function titleFromPath(pathname: string) {
  if (pathname.startsWith("/admin/products/new")) return "Add Product";
  if (pathname.includes("/admin/products/") && pathname.endsWith("/edit")) return "Edit Product";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/orders")) return "Orders";
  if (pathname.startsWith("/admin/users")) return "Users";
  if (pathname.startsWith("/admin/payments")) return "Payments";
  if (pathname.startsWith("/admin/reports")) return "Reports";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Overview";
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.role);
  const user = useAppSelector((s) => s.auth.user);

  const title = useMemo(() => titleFromPath(pathname), [pathname]);

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900 sm:text-base">{title}</h1>
          {role ? <Badge>{formatRole(role)}</Badge> : null}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-sm text-slate-600 sm:block">{user?.email || user?.phone || ""}</div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              dispatch(logoutAndReset() as unknown as never);
              router.replace("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
