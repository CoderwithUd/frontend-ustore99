"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { useDeleteProductMutation, useGetProductsQuery } from "@/features/products/productsApi";
import type { Product } from "@/features/products/types";

const ConfirmDialog = dynamic(() => import("@/components/ui/ConfirmDialog").then((m) => m.ConfirmDialog), {
  ssr: false
});

function sumStock(p: Product) {
  return (p.variants ?? []).reduce((acc, v) => acc + (v.stock ?? 0), 0);
}

export function ProductsClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [isActive, setIsActive] = useState<"" | boolean>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const queryArgs = useMemo(
    () => ({ search, category, brand, gender, isActive, page, limit }),
    [search, category, brand, gender, isActive, page]
  );
  const { data, isLoading, isError, refetch } = useGetProductsQuery(queryArgs);

  async function onConfirmDelete() {
    if (!deleteId) return;
    try {
      const res = await deleteProduct(deleteId).unwrap();
      toast.success(res.message || "Product deleted");
      setDeleteId(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete product");
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-slate-600">Search, filter, and manage your catalog.</p>
        </div>
        <LinkButton href="/admin/products/new">Add Product</LinkButton>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <Input
              label="Search"
              placeholder="Name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Input
              label="Category"
              placeholder="e.g. T-Shirts"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            />
            <Input
              label="Brand"
              placeholder="e.g. UStore99"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setPage(1);
              }}
            />
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </Select>
            <Select
              label="Active"
              value={isActive === "" ? "" : isActive ? "true" : "false"}
              onChange={(e) => {
                const v = e.target.value;
                setIsActive(v === "" ? "" : v === "true");
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <div className="space-y-2">
              <p className="text-sm text-rose-600">Failed to load products.</p>
              <Button variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : (data?.items?.length ?? 0) === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-900">No products found</p>
              <p className="mt-1 text-sm text-slate-600">Try changing filters or add a new product.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs text-slate-500">
                    <tr>
                      <th className="py-2">Name</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Brand</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Stock</th>
                      <th className="py-2">Active</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.items.map((p) => (
                      <tr key={p._id} className="border-t border-slate-100">
                        <td className="py-3 font-medium text-slate-900">{p.name}</td>
                        <td className="py-3 text-slate-700">{p.category || "-"}</td>
                        <td className="py-3 text-slate-700">{p.brand || "-"}</td>
                        <td className="py-3 text-slate-700">
                          {p.pricing?.currency || "INR"} {p.pricing?.sellingPrice ?? "-"}
                        </td>
                        <td className="py-3 text-slate-700">{sumStock(p)}</td>
                        <td className="py-3">
                          <Badge variant={p.isActive ? "success" : "default"}>{p.isActive ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/admin/products/${p._id}/edit`}
                              className="rounded-lg px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                              Edit
                            </Link>
                            <button
                              className="rounded-lg px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
                              onClick={() => setDeleteId(p._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={data!.page} total={data!.total} limit={data!.limit} onChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete product?"
        description="This action cannot be undone."
        confirmText="Delete"
        tone="danger"
        isLoading={isDeleting}
        onConfirm={onConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}

