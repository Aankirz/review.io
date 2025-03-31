import { ProductPageClient } from "@/components/Product/ProductPage";

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient id={params.id} />;
} 