"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ className, label, error, id, children, ...props }: SelectProps) {
  const autoId = React.useId();
  const selectId = id ?? autoId;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm shadow-sm outline-none",
          error ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-brand-300",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

