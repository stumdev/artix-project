'use client'
import { useEffect, useState } from "react";
import { Keygens, Products } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function EditKeygen() {
  const params = useParams(); const id = Number(params?.id as string);
  const router = useRouter();
  const [form, setForm] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const set = (k:string, v:any) => setForm((prev:any) => ({...prev, [k]: v}));

  useEffect(() => { (async () => {
    const list = await Keygens.list();
    const it = list.find((x:any) => x.id === id);
    setForm(it);
    setProducts(await Products.list());
  })(); }, [id]);

  if (!form) return <div>Carregando...</div>;

  async function save() {
    setBusy(true);
    try {
      await Keygens.update(id, {
        name: form.name, prefix: form.prefix, chunks: form.chunks, chunk_size: form.chunk_size,
        separator: form.separator, enabled: form.enabled, product_id: form.product_id
      });
      router.push('/admin/keygens');
    } finally { setBusy(false); }
  }

  async function del() {
    if (!confirm('Deletar keygen?')) return;
    await Keygens.del(id);
    router.push('/admin/keygens');
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Editar Keygen #{id}</h2>
      <div className="card p-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2"><span className="text-sm">Nome</span><input className="input" value={form.name} onChange={e=>set('name', e.target.value)} /></label>
        <label className="grid gap-2"><span className="text-sm">Prefixo</span><input className="input" value={form.prefix} onChange={e=>set('prefix', e.target.value)} /></label>
        <label className="grid gap-2"><span className="text-sm">Chunks</span><input className="input" type="number" value={form.chunks} onChange={e=>set('chunks', Number(e.target.value))} /></label>
        <label className="grid gap-2"><span className="text-sm">Chunk Size</span><input className="input" type="number" value={form.chunk_size} onChange={e=>set('chunk_size', Number(e.target.value))} /></label>
        <label className="grid gap-2"><span className="text-sm">Separador</span><input className="input" value={form.separator} onChange={e=>set('separator', e.target.value)} /></label>
        <label className="grid gap-2">
          <span className="text-sm">Produto</span>
          <select className="select" value={form.product_id || ''} onChange={e=>set('product_id', Number(e.target.value))}>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.enabled} onChange={e=>set('enabled', e.target.checked)} /> Ativo</label>
      </div>
      <div className="flex gap-2">
        <a className="btn btn-muted" href="/admin/keygens">Voltar</a>
        <button className="btn btn-primary" disabled={busy} onClick={save}>Salvar</button>
        <button className="btn btn-danger ml-auto" onClick={del}>Deletar</button>
      </div>
    </div>
  );
}
