import type { Metadata } from "next";
import { EditProductClient } from "@/app/admin/products/[id]/edit/EditProductClient";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product details"
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <EditProductClient id={params.id} />;
}
