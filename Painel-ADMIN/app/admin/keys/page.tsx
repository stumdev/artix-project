import Toolbar from "@/components/Toolbar";
import { Keys, Keygens } from "@/lib/api";
import ClientTable from "./ClientTable";

export const dynamic = "force-dynamic";

export default async function KeysPage({ searchParams }: { searchParams: Record<string, string> }) {
  const q = new URLSearchParams(searchParams as any);
  const data = await Keys.list(q);
  const keygens = await Keygens.list();
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Keys</h2>
        <a className="btn btn-primary" href="/admin/keys/new">+ Criar Keys</a>
      </div>
      <Toolbar keygens={keygens} />
      <ClientTable data={data} keygens={keygens} />
    </div>
  );
}
