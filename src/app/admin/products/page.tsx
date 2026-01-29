import type { Metadata } from "next";
import { ProductsClient } from "@/app/admin/products/ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products"
};

export default function ProductsPage() {
  return <ProductsClient />;
}
