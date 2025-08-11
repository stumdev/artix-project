'use client'
import { useEffect, useState } from "react";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import { slugify } from "@/lib/slug";
import { Products } from "@/lib/api";
import { normalizeDecimalInput, format2Decimals, toCents } from "@/lib/money";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const params = useParams(); const id = Number(params?.id as string);
  const router = useRouter();
  const [form, setForm] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [unlimited, setUnlimited] = useState(false);
  const { isAuto, onSlugChange, regenerateFromName } = useAutoSlug({
    name: form?.name || '',
    slug: form?.slug || '',
    setSlug: (v) => set('slug', v),
    initialAuto: !(form?.slug),
  });

  const set = (k:string, v:any) => setForm((prev:any) => ({...prev, [k]: v}));

  useEffect(() => { (async () => {
    const list = await Products.list();
    const it = list.find((x:any) => x.id === id);
    setForm({ ...it, price: (it.price_cents ?? 0) / 100 });
    setUnlimited(it?.max_servers == null);
  })(); }, [id]);

  if (!form) return <div>Carregando...</div>;

  async function save() {
    setBusy(true);
    try {
      const payload = {
        slug: (form.slug?.trim() ? form.slug : slugify(form.name)),
        name: form.name,
        description: form.description,
        price_cents: toCentsLoose(form.price),
        currency: form.currency,
        is_active: form.is_active,
        max_servers: unlimited ? null : form.max_servers
      };
      console.log('DBG price ->', { raw: form.price, cents: toCentsLoose(form.price) });

    delete (payload as any).price;
      await Products.update(id, payload);
      router.push('/admin/products');
    } finally { setBusy(false); }
  }

  async function del() {
    if (!confirm('Deletar produto?')) return;
    await Products.del(id);
    router.push('/admin/products');
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Editar Produto #{id}</h2>
      <div className="card p-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2"><div className="flex items-center justify-between"><span className="text-sm">Slug</span>{!isAuto && (<button type="button" onClick={regenerateFromName} className="text-xs underline opacity-70 hover:opacity-100">Voltar a gerar do nome</button>)}</div><input className="input" value={form.slug} onChange={e=>{ onSlugChange(e); set('slug', e.target.value); }} /></label>
        <label className="grid gap-2"><span className="text-sm">Nome</span><input className="input" value={form.name} onChange={e=>set('name', e.target.value)} /></label>
        <label className="grid gap-2 sm:col-span-2"><span className="text-sm">Descrição</span><textarea className="input" rows={4} value={form.description ?? ''} onChange={e=>set('description', e.target.value)} /></label>
        <label className="grid gap-2"><span className="text-sm">Preço</span>
        <input
          className="input"
          type="text"
          inputMode="decimal"
          value={form.price}
          onChange={e => set('price', e.target.value)}
          onBlur={e => { const v = e.target.value.replace(',', '.'); const n = parseFloat(v); set('price', isNaN(n) ? '' : n.toFixed(2)); }}
        /></label>
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
        <a className="btn btn-muted" href="/admin/products">Voltar</a>
        <button className="btn btn-primary" disabled={busy} onClick={save}>Salvar</button>
        <button className="btn btn-danger ml-auto" onClick={del}>Deletar</button>
      </div>
    </div>
  );
}
