import { Suspense } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { UnauthorizedToast } from "@/components/route/UnauthorizedToast";

export const metadata: Metadata = {
  title: "Overview",
  description: "Admin dashboard overview"
};

const stats = [
  { label: "Sales", value: "₹1,24,900", hint: "+12% vs last week" },
  { label: "Orders", value: "312", hint: "Last 7 days" },
  { label: "Pending Tasks", value: "9", hint: "Needs attention" },
  { label: "Tax", value: "₹18,430", hint: "Estimated" },
  { label: "Reports", value: "4", hint: "Generated this month" }
];

const recentOrders = [
  { id: "ORD-1021", customer: "Aarav", total: "₹1,299", status: "Paid" },
  { id: "ORD-1020", customer: "Isha", total: "₹899", status: "Pending" },
  { id: "ORD-1019", customer: "Kabir", total: "₹2,499", status: "Paid" },
  { id: "ORD-1018", customer: "Meera", total: "₹1,149", status: "Refund" }
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <UnauthorizedToast />
      </Suspense>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="py-5">
              <div className="text-sm font-medium text-slate-600">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-2 text-xs text-slate-500">{s.hint}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent orders</h3>
              <Badge>UI Placeholder</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="py-2">Order</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-slate-100">
                      <td className="py-3 font-medium text-slate-900">{o.id}</td>
                      <td className="py-3 text-slate-700">{o.customer}</td>
                      <td className="py-3 text-slate-700">{o.total}</td>
                      <td className="py-3 text-slate-700">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Weekly trend</h3>
              <Badge>Chart</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-28 w-full" />
              <p className="text-sm text-slate-600">
                Replace this with a real chart when analytics APIs are ready.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
