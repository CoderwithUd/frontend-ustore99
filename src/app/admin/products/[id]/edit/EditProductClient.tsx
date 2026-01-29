"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductForm, type ProductFormValues } from "@/features/products/ProductForm";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/features/products/productsApi";

export function EditProductClient({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  async function onSubmit(values: ProductFormValues) {
    const tags = (values.tagsText || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const images = (values.images || []).map((i) => ({ url: i.url.trim(), alt: i.alt?.trim() || "" })).filter((i) => i.url);

    try {
      await updateProduct({
        id,
        patch: {
          name: values.name,
          description: values.description || "",
          brand: values.brand,
          category: values.category,
          gender: values.gender,
          material: values.material || "",
          pricing: {
            mrp: values.pricingMrp,
            sellingPrice: values.pricingSellingPrice,
            currency: values.pricingCurrency || "INR",
            taxPercent: values.pricingTaxPercent
          },
          variants: values.variants.map((v) => ({
            sku: v.sku,
            size: v.size || "",
            color: v.color || "",
            stock: v.stock,
            price: v.price
          })),
          images,
          tags,
          isActive: values.isActive
        }
      }).unwrap();
      toast.success("Product updated");
      router.replace("/admin/products");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update product");
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <p className="mt-1 text-sm text-slate-600">Update product details.</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError || !data ? (
            <div className="space-y-2">
              <p className="text-sm text-rose-600">Failed to load product.</p>
              <button className="text-sm font-medium text-brand-700 hover:underline" onClick={() => refetch()}>
                Try again
              </button>
            </div>
          ) : (
            <ProductForm initial={data} submitLabel="Save changes" isSubmitting={isSaving} onSubmit={onSubmit} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

