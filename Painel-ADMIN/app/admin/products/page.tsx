import { Products } from "@/lib/api";
import ProductsClient from "./ClientPage";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const items = await Products.list();
  return <ProductsClient items={items} />;
}
