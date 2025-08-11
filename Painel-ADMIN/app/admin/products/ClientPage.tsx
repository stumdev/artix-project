'use client'
import { useMemo, useState } from "react";
import { Products } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14.06 6.19l3.75 3.75L20.5 7.25a1.77 1.77 0 0 0 0-2.5l-1.25-1.25a1.77 1.77 0 0 0-2.5 0l-2.69 2.69Z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function isActiveFlag(v: any): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  const s = String(v ?? '').toLowerCase();
  return s === 'true' || s === 'sim' || s === 'yes' || s === 'y' || s === '1';
}

function getActiveFromProduct(p: any): boolean {
  const candidates = [p?.active, p?.enabled, p?.is_active, p?.status, p?.state];

  for (const v of candidates) {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;

    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (["active", "true", "1", "sim", "yes", "y"].includes(s)) return true;
      if (["inactive", "false", "0", "não", "nao", "no", "n"].includes(s)) return false;
    }
  }
  return false; // default seguro
}

export default function ProductsClient({ items }: { items: any[] }) {
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (p) =>
        String(p.id).includes(s) ||
        (p.slug ?? "").toLowerCase().includes(s) ||
        (p.name ?? "").toLowerCase().includes(s)
    );
  }, [items, q]);

  async function del(id: number) {
    if (!confirm("Deletar este produto?")) return;
    setBusyId(id);
    try {
      await Products.del(id);
      location.reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Produtos</h2>
        <a className="btn btn-primary text-white" href="/admin/products/new">
          + Criar Produto
        </a>
      </div>

      {/* barra de busca dentro de card (igual ao Keys) */}
      <div className="card p-3">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou slug..."
            className="input w-full"
          />
        </div>
      </div>

      <div className="card p-4 overflow-x-auto">
        <table className="table table-fixed">
          <colgroup>
            <col style={{ width: 80 }} />{/* ID */}
            <col style={{ width: 180 }} />{/* Slug */}
            <col />{/* Nome */}
            <col style={{ width: 120 }} />{/* Preço */}
            <col style={{ width: 120 }} />{/* Status */}
            <col style={{ width: 220 }} />{/* Ações */}
          </colgroup>
          <thead>
            <tr>
              <th>ID</th>
              <th>Slug</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-900/30">
                <td className="py-3 align-middle">{p.id}</td>
                <td className="py-3 align-middle text-slate-400">{p.slug}</td>
                <td className="py-3 align-middle"><div className="truncate">{p.name}</div></td>
                <td className="py-3 align-middle">R$ {((p.price != null ? Number(p.price) : Number(p.price_cents ?? 0) / 100).toFixed(2))}</td>
                <td className="py-3 align-middle">
                  <StatusBadge value={getActiveFromProduct(p) ? "ACTIVE" : "INACTIVE"} />
                </td>
                <td className="py-3 align-middle">
                  <div className="flex justify-end gap-2">
                    <a className="btn" href={`/admin/products/${p.id}`}>
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Editar
                    </a>
                    <button
                      className="btn btn-danger"
                      disabled={busyId === p.id}
                      onClick={() => del(p.id)}
                    >
                      {busyId === p.id ? "..." : "Deletar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-8">Nenhum produto</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
