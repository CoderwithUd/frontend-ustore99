"use client";

import { Card, CardContent } from "@/components/ui/Card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-base font-semibold">{title}</h3>
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
          {action}
        </div>
      </CardContent>
    </Card>
  );
}
