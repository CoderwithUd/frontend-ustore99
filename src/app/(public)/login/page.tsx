import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginClient } from "@/app/(public)/login/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to continue"
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
