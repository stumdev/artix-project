'use client'
import { useMemo, useState } from "react";
import { Keygens } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14.06 6.19l3.75 3.75L20.5 7.25a1.77 1.77 0 0 0 0-2.5l-1.25-1.25a1.77 1.77 0 0 0-2.5 0l-2.69 2.69Z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export default function KeygensClient({ items, productName }: { items: any[]; productName: Record<number, string> }) {
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (k) =>
        String(k.id).includes(s) ||
        (k.name ?? "").toLowerCase().includes(s) ||
        (k.prefix ?? "").toLowerCase().includes(s) ||
        (productName[k.product_id] ?? "").toLowerCase().includes(s)
    );
  }, [items, q, productName]);

  async function del(id: number) {
    if (!confirm("Deletar este keygen?")) return;
    setBusyId(id);
    try {
      await Keygens.del(id);
      location.reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Keygens</h2>
        <a className="btn btn-primary text-white" href="/admin/keygens/new">
          + Criar Keygen
        </a>
      </div>

      {/* barra de busca dentro de card (igual ao Keys) */}
      <div className="card p-3">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, prefixo ou produto..."
            className="input w-full"
          />
        </div>
      </div>

      <div className="card p-4 overflow-x-auto">
        <table className="table table-fixed">
          <colgroup>
            <col style={{ width: 80 }} />{/* ID */}
            <col />{/* Nome */}
            <col style={{ width: 120 }} />{/* Prefixo */}
            <col style={{ width: 110 }} />{/* Chunks */}
            <col style={{ width: 110 }} />{/* Tamanho */}
            <col style={{ width: 160 }} />{/* Produto */}
            <col style={{ width: 110 }} />{/* Ativo */}
            <col style={{ width: 220 }} />{/* Ações */}
          </colgroup>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Prefixo</th>
              <th>Chunks</th>
              <th>Tamanho</th>
              <th>Produto</th>
              <th>Ativo</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((k) => (
              <tr key={k.id} className="hover:bg-slate-900/30">
                <td className="py-3 align-middle">{k.id}</td>
                <td className="py-3 align-middle"><div className="truncate">{k.name}</div></td>
                <td className="py-3 align-middle">{k.prefix}</td>
                <td className="py-3 align-middle">{k.chunks}</td>
                <td className="py-3 align-middle">{k.chunk_size}</td>
                <td className="py-3 align-middle"><div className="truncate">{productName[k.product_id] ?? "-"}</div></td>
                <td className="py-3 align-middle">
                  <StatusBadge value={k.enabled ? "ACTIVE" : "INACTIVE"} />
                </td>
                <td className="py-3 align-middle">
                  <div className="flex justify-end gap-2">
                    <a className="btn" href={`/admin/keygens/${k.id}`}>
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Editar
                    </a>
                    <button
                      className="btn btn-danger"
                      disabled={busyId === k.id}
                      onClick={() => del(k.id)}
                    >
                      {busyId === k.id ? "..." : "Deletar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-slate-400 py-8">Nenhum keygen</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
