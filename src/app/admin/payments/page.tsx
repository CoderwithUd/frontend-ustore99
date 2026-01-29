import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Payments</h2>
        <p className="mt-1 text-sm text-slate-600">Coming soon.</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">This page is a placeholder for future integrations.</p>
      </CardContent>
    </Card>
  );
}

