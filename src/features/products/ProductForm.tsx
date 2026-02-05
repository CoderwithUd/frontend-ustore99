"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Product, ProductGender } from "@/features/products/types";

const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional());

const schema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  gender: z.enum(["men", "women", "kids", "unisex"]),
  material: z.string().optional(),

  pricingMrp: optionalNumber(z.coerce.number().min(0, "MRP must be ≥ 0")),
  pricingSellingPrice: z.coerce.number().positive("Selling price must be > 0"),
  pricingCurrency: z.string().default("INR"),
  pricingTaxPercent: optionalNumber(z.coerce.number().min(0, "Tax must be ≥ 0").max(100, "Tax must be ≤ 100")),

  isActive: z.boolean().default(true),
  tagsText: z.string().optional(),

  variants: z
    .array(
      z.object({
        sku: z.string().min(2, "SKU is required"),
        size: z.string().optional(),
        color: z.string().optional(),
        stock: optionalNumber(z.coerce.number().int("Stock must be an integer").min(0, "Stock must be ≥ 0")),
        price: optionalNumber(z.coerce.number().min(0, "Price must be ≥ 0"))
      })
    )
    .min(1, "At least one variant is required"),

  images: z
    .array(
      z.object({
        url: z.string().url("Enter a valid image URL"),
        alt: z.string().optional()
      })
    )
    .default([])
});

export type ProductFormValues = z.infer<typeof schema>;

function productToDefaults(product?: Partial<Product>): ProductFormValues {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    brand: product?.brand ?? "UStore99",
    category: product?.category ?? "",
    gender: (product?.gender as ProductGender) || "unisex",
    material: product?.material ?? "",

    pricingMrp: product?.pricing?.mrp ?? undefined,
    pricingSellingPrice: product?.pricing?.sellingPrice ?? 0,
    pricingCurrency: product?.pricing?.currency ?? "INR",
    pricingTaxPercent: product?.pricing?.taxPercent ?? undefined,

    isActive: product?.isActive ?? true,
    tagsText: (product?.tags ?? []).join(", "),

    variants:
      product?.variants?.length
        ? product.variants.map((v) => ({
            sku: v.sku ?? "",
            size: v.size ?? "",
            color: v.color ?? "",
            stock: v.stock ?? undefined,
            price: v.price ?? undefined
          }))
        : [{ sku: "", size: "", color: "", stock: undefined, price: undefined }],

    images:
      product?.images?.length
        ? product.images.map((i) => ({ url: i.url ?? "", alt: i.alt ?? "" }))
        : [{ url: "", alt: "" }]
  };
}

export function ProductForm({
  initial,
  submitLabel,
  isSubmitting,
  onSubmit,
  secondaryAction
}: {
  initial?: Partial<Product>;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  secondaryAction?: {
    label: string;
    handler: (values: ProductFormValues) => void | Promise<void>;
  };
}) {
  const defaults = useMemo(() => productToDefaults(initial), [initial]);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults
  });

  const variants = useFieldArray({ control: form.control, name: "variants" });
  const images = useFieldArray({ control: form.control, name: "images" });

  async function onSecondaryAction() {
    if (!secondaryAction) return;

    const isValid = await form.trigger();
    if (isValid) {
      await secondaryAction.handler(form.getValues());
      form.reset(productToDefaults());
    }
  }


  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Product Name" placeholder="Classic Cotton T-Shirt" error={form.formState.errors.name?.message} {...form.register("name")} />
        <Input label="Brand" placeholder="UStore99" error={form.formState.errors.brand?.message} {...form.register("brand")} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input label="Category" placeholder="T-Shirts" error={form.formState.errors.category?.message} {...form.register("category")} />
        <Select label="Gender" error={form.formState.errors.gender?.message} {...form.register("gender")}>
          <option value="unisex">Unisex</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </Select>
        <Input label="Material (optional)" placeholder="100% Cotton" error={form.formState.errors.material?.message} {...form.register("material")} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Description (optional)</label>
        <textarea
          className="min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-300"
          placeholder="Soft, breathable cotton tee for everyday wear."
          {...form.register("description")}
        />
        {form.formState.errors.description?.message ? (
          <p className="text-xs text-rose-600">{form.formState.errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Input label="MRP (optional)" type="number" step="1" error={form.formState.errors.pricingMrp?.message as string | undefined} {...form.register("pricingMrp")} />
        <Input label="Selling Price" type="number" step="1" error={form.formState.errors.pricingSellingPrice?.message} {...form.register("pricingSellingPrice")} />
        <Input label="Currency" placeholder="INR" error={form.formState.errors.pricingCurrency?.message} {...form.register("pricingCurrency")} />
        <Input label="Tax (%) (optional)" type="number" step="1" error={form.formState.errors.pricingTaxPercent?.message as string | undefined} {...form.register("pricingTaxPercent")} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Variants</h3>
            <p className="text-xs text-slate-600">Add SKUs with size/color/stock.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => variants.append({ sku: "", size: "", color: "", stock: undefined, price: undefined })}
          >
            Add Variant
          </Button>
        </div>

        {typeof form.formState.errors.variants?.message === "string" ? (
          <p className="mt-2 text-xs text-rose-600">{form.formState.errors.variants.message}</p>
        ) : null}

        <div className="mt-4 space-y-3">
          {variants.fields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <Input
                  label="SKU"
                  placeholder="TS-BLK-M"
                  error={form.formState.errors.variants?.[idx]?.sku?.message}
                  {...form.register(`variants.${idx}.sku` as const)}
                />
                <Input
                  label="Size (optional)"
                  placeholder="M"
                  error={form.formState.errors.variants?.[idx]?.size?.message}
                  {...form.register(`variants.${idx}.size` as const)}
                />
                <Input
                  label="Color (optional)"
                  placeholder="Black"
                  error={form.formState.errors.variants?.[idx]?.color?.message}
                  {...form.register(`variants.${idx}.color` as const)}
                />
                <Input
                  label="Stock (optional)"
                  type="number"
                  step="1"
                  error={form.formState.errors.variants?.[idx]?.stock?.message as string | undefined}
                  {...form.register(`variants.${idx}.stock` as const)}
                />
                <Input
                  label="Price (optional)"
                  type="number"
                  step="1"
                  error={form.formState.errors.variants?.[idx]?.price?.message as string | undefined}
                  {...form.register(`variants.${idx}.price` as const)}
                />
              </div>
              {variants.fields.length > 1 ? (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-rose-700 hover:underline"
                    onClick={() => variants.remove(idx)}
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Images</h3>
            <p className="text-xs text-slate-600">Add image URLs (Cloudinary upload is optional in backend).</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => images.append({ url: "", alt: "" })}>
            Add Image
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {images.fields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  label="URL"
                  placeholder="https://example.com/images/tshirt-1.jpg"
                  error={form.formState.errors.images?.[idx]?.url?.message}
                  {...form.register(`images.${idx}.url` as const)}
                />
                <Input
                  label="Alt (optional)"
                  placeholder="Classic Cotton T-Shirt"
                  error={form.formState.errors.images?.[idx]?.alt?.message}
                  {...form.register(`images.${idx}.alt` as const)}
                />
              </div>
              {images.fields.length > 1 ? (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-rose-700 hover:underline"
                    onClick={() => images.remove(idx)}
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Tags (comma separated, optional)"
          placeholder="basic, cotton, daily-wear"
          error={form.formState.errors.tagsText?.message}
          {...form.register("tagsText")}
        />
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...form.register("isActive")} />
            Active product
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {secondaryAction ? (
          <Button type="button" variant="secondary" onClick={onSecondaryAction} isLoading={isSubmitting}>
            {secondaryAction.label}
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
