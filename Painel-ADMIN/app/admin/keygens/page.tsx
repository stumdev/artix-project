import { Keygens, Products } from "@/lib/api";
import KeygensClient from "./ClientPage";

export const dynamic = "force-dynamic";

export default async function KeygensPage() {
  const [items, products] = await Promise.all([Keygens.list(), Products.list()]);
  const map = Object.fromEntries(products.map((p: any) => [p.id, p.name]));
  return <KeygensClient items={items} productName={map} />;
}
