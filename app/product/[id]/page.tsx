import { ProductPageClient } from "@/components/Product/ProductPage";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient id={params.id} />;
} 