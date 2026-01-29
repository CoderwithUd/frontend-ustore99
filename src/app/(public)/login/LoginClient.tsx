"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useLazyMeQuery, useLoginMutation } from "@/features/auth/authApi";
import { authActions } from "@/features/auth/authSlice";
import { setAuthCookies } from "@/lib/cookies";
import { decodeJwtPayload } from "@/lib/jwt";
import type { Role } from "@/lib/constants";
import { useAppDispatch } from "@/store/hooks";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true)
});

type FormValues = z.infer<typeof schema>;

export function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [triggerMe] = useLazyMeQuery();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: true }
  });

  useEffect(() => {
    form.setFocus("email");
  }, [form]);

  async function onSubmit(values: FormValues) {
    try {
      const res = await login({ email: values.email, password: values.password, rememberMe: values.rememberMe }).unwrap();
      const token = res.token || res.accessToken;
      if (!token) throw new Error("Login succeeded but no token was returned.");

      const payload = decodeJwtPayload(token);
      const roleHint = (payload?.role as Role | undefined) ?? (payload?.userRole as Role | undefined);

      setAuthCookies({ token, role: roleHint, rememberMe: values.rememberMe });
      dispatch(authActions.setToken(token));

      const me = await triggerMe().unwrap();
      dispatch(authActions.setUser(me));
      if (me.role) {
        dispatch(authActions.setRole(me.role));
        setAuthCookies({ token, role: me.role, rememberMe: values.rememberMe });
      } else if (roleHint) {
        dispatch(authActions.setRole(roleHint));
      }

      toast.success("Welcome back!");
      router.replace(next || "/admin/overview");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Login failed. Please try again.";
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 md:grid-cols-2 md:px-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
            Ustore99 · Admin Panel
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Manage your store with clarity.
          </h1>
          <p className="max-w-md text-base text-slate-600">
            Clean, minimal admin experience for products, orders, and operations.
          </p>
        </div>

        <Card className="w-full max-w-md md:justify-self-end">
          <CardHeader>
            <h2 className="text-lg font-semibold">Login to continue</h2>
            <p className="mt-1 text-sm text-slate-600">Use your email and password.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <Input
                label="Email"
                placeholder="ali@example.com"
                autoComplete="username"
                error={form.formState.errors.email?.message}
                {...form.register("email")}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                error={form.formState.errors.password?.message}
                {...form.register("password")}
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...form.register("rememberMe")} />
                Remember me
              </label>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Login
              </Button>
              <p className="text-xs text-slate-500">
                By continuing, you agree to follow your organization&apos;s access policies.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

