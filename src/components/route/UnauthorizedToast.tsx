"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function UnauthorizedToast() {
  const router = useRouter();
  const params = useSearchParams();
  const unauthorized = params.get("unauthorized");

  useEffect(() => {
    if (unauthorized !== "1") return;
    toast.error("Not authorized to access that page.");
    const next = new URLSearchParams(params.toString());
    next.delete("unauthorized");
    router.replace(`/admin/overview${next.toString() ? `?${next.toString()}` : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unauthorized]);

  return null;
}

