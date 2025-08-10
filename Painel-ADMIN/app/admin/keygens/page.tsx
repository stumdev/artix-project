import { Keygens, Products } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function KeygensPage() {
  const [items, products] = await Promise.all([Keygens.list(), Products.list()]);
  const map = Object.fromEntries(products.map((p:any) => [p.id, p.name]));
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Keygens</h2>
        <a className="btn btn-primary" href="/admin/keygens/new">+ Criar Keygen</a>
      </div>
      <div className="card p-4 overflow-x-auto">
        <table className="table">
          <thead><tr><th>ID</th><th>Nome</th><th>Prefixo</th><th>Chunks</th><th>Produto</th><th>Ativo</th><th></th></tr></thead>
          <tbody>
            {items.map((kg:any) => (
              <tr key={kg.id}>
                <td>{kg.id}</td>
                <td>{kg.name}</td>
                <td>{kg.prefix}</td>
                <td>{kg.chunks}×{kg.chunk_size}</td>
                <td>{map[kg.product_id] ?? kg.product_id}</td>
                <td>{kg.enabled ? 'sim' : 'não'}</td>
                <td><a className="btn" href={`/admin/keygens/${kg.id}`}>Editar</a></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="text-center text-slate-400 py-8">Nenhum keygen</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
