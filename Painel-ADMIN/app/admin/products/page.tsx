import { Products } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const items = await Products.list();
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Produtos</h2>
        <a className="btn btn-primary" href="/admin/products/new">+ Criar Produto</a>
      </div>
      <div className="card p-4 overflow-x-auto">
        <table className="table">
          <thead><tr><th>ID</th><th>Slug</th><th>Nome</th><th>Preço</th><th>Ativo</th><th></th></tr></thead>
          <tbody>
            {items.map((p:any) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.slug}</td>
                <td>{p.name}</td>
                <td>R$ {(p.price_cents/100).toFixed(2)}</td>
                <td>{p.is_active ? 'sim' : 'não'}</td>
                <td><a className="btn" href={`/admin/products/${p.id}`}>Editar</a></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="text-center text-slate-400 py-8">Nenhum produto</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
