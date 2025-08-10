'use client'
import { useState } from "react";
import { Products } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({ slug:'', name:'', description:'', price_cents:0, currency:'BRL', is_active:true, max_servers:1 });
  const [unlimited, setUnlimited] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k:string, v:any) => setForm(prev => ({...prev, [k]: v}));

  async function save() {
    setBusy(true);
    try {
      const payload = { ...form, max_servers: unlimited ? null : form.max_servers };
      await Products.create(payload);
      router.push('/admin/products');
    } finally { setBusy(false); }
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Novo Produto</h2>
      <div className="card p-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2"><span className="text-sm">Slug</span><input className="input" value={form.slug} onChange={e=>set('slug', e.target.value)} /></label>
        <label className="grid gap-2"><span className="text-sm">Nome</span><input className="input" value={form.name} onChange={e=>set('name', e.target.value)} /></label>
        <label className="grid gap-2 sm:col-span-2"><span className="text-sm">Descrição</span><textarea className="input" rows={4} value={form.description} onChange={e=>set('description', e.target.value)} /></label>
        <label className="grid gap-2"><span className="text-sm">Preço (centavos)</span><input className="input" type="number" value={form.price_cents} onChange={e=>set('price_cents', Number(e.target.value))} /></label>
        <label className="grid gap-2"><span className="text-sm">Moeda</span><input className="input" value={form.currency} onChange={e=>set('currency', e.target.value)} /></label>
        <div className="grid gap-2">
          <span className="text-sm">Limite de servidores</span>
          <div className="flex items-center gap-3">
            <input className="input w-32" type="number" min={1} value={form.max_servers ?? 1} onChange={e=>set('max_servers', Number(e.target.value))} disabled={unlimited} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={unlimited} onChange={e=>setUnlimited(e.target.checked)} />
              Sem limite
            </label>
          </div>
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e=>set('is_active', e.target.checked)} /> Ativo</label>
      </div>
      <div className="flex gap-2">
        <a className="btn btn-muted" href="/admin/products">Cancelar</a>
        <button className="btn btn-primary" disabled={busy} onClick={save}>Salvar</button>
      </div>
    </div>
  );
}
