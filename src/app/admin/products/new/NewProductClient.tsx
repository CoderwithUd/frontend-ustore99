"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ProductForm, type ProductFormValues } from "@/features/products/ProductForm";
import { useCreateProductMutation } from "@/features/products/productsApi";

export function NewProductClient() {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  async function onSubmit(values: ProductFormValues, redirect = true) {
    const tags = (values.tagsText || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const images = (values.images || []).map((i) => ({ url: i.url.trim(), alt: i.alt?.trim() || "" })).filter((i) => i.url);

    try {
      await createProduct({
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
      }).unwrap();

      toast.success("Product created");
      if (redirect) {
        router.replace("/admin/products");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create product");
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Add Product</h2>
          <p className="mt-1 text-sm text-slate-600">Create a new product in your catalog.</p>
        </CardHeader>
        <CardContent>
          <ProductForm
            submitLabel="Create"
            isSubmitting={isLoading}
            onSubmit={onSubmit}
            secondaryAction={{ label: "Save and Add Another", handler: (v) => onSubmit(v, false) }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

