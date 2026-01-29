import type { Metadata } from "next";
import { NewProductClient } from "@/app/admin/products/new/NewProductClient";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Create a new product"
};

export default function NewProductPage() {
  return <NewProductClient />;
}
