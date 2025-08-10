'use client'
import { useEffect, useState } from "react";
import { Keygens, Products } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewKeygen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name:'', prefix:'ARTIX', chunks:5, chunk_size:5, separator:'-', enabled:true, product_id: 0 });
  const [busy, setBusy] = useState(false);
  const set = (k:string, v:any) => setForm(prev => ({...prev, [k]: v}));
  useEffect(() => { (async () => setProducts(await Products.list()))(); }, []);

  async function save() {
    if (!form.product_id) { alert('Selecione um produto'); return; }
    setBusy(true);
    try {
      await Keygens.create(form);
      router.push('/admin/keygens');
    } finally { setBusy(false); }
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Novo Keygen</h2>
      <div className="card p-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2"><span className="text-sm">Nome</span><input className="input" value={form.name} onChange={e=>set('name', e.target.value)} /></label>
        <label className="grid gap-2"><span className="text-sm">Prefixo</span><input className="input" value={form.prefix} onChange={e=>set('prefix', e.target.value)} /></label>
        <label className="grid gap-2"><span className="text-sm">Chunks</span><input className="input" type="number" value={form.chunks} onChange={e=>set('chunks', Number(e.target.value))} /></label>
        <label className="grid gap-2"><span className="text-sm">Chunk Size</span><input className="input" type="number" value={form.chunk_size} onChange={e=>set('chunk_size', Number(e.target.value))} /></label>
        <label className="grid gap-2"><span className="text-sm">Separador</span><input className="input" value={form.separator} onChange={e=>set('separator', e.target.value)} /></label>
        <label className="grid gap-2">
          <span className="text-sm">Produto</span>
          <select className="select" value={form.product_id || ''} onChange={e=>set('product_id', Number(e.target.value))}>
            <option value="" disabled>Selecione...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.enabled} onChange={e=>set('enabled', e.target.checked)} /> Ativo</label>
      </div>
      <div className="flex gap-2">
        <a className="btn btn-muted" href="/admin/keygens">Cancelar</a>
        <button className="btn btn-primary" disabled={busy} onClick={save}>Salvar</button>
      </div>
    </div>
  );
}
