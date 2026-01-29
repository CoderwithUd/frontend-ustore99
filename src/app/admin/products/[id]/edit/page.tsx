// import type { Metadata } from "next";
// import { EditProductClient } from "@/app/admin/products/[id]/edit/EditProductClient";

// export const metadata: Metadata = {
//   title: "Edit Product",
//   description: "Edit product details"
// };

// export default function EditProductPage({ params }: { params: { id: string } }) {
//   return <EditProductClient id={params.id} />;
// }

import type { Metadata } from "next";
import { EditProductClient } from "./EditProductClient"; // best: relative import

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product details",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("PAGE PARAM ID:", id, typeof id); // terminal me aayega
  return <EditProductClient id={id} />;
}
