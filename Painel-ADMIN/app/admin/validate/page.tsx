'use client'
import { useState } from "react";
import { Plugin } from "@/lib/api";

export default function ValidatePage() {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<any | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setBusy(true);
    try {
      const data = await Plugin.check(key.trim());
      setRes(data);
    } catch (e) {
      alert('Erro ao consultar');
    } finally { setBusy(false); }
  }
  return (
    <div className="grid gap-4 max-w-2xl">
      <h2 className="text-xl font-semibold">Validar Key</h2>
      <form onSubmit={submit} className="card p-4 grid gap-3">
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Código da Key</span>
          <input className="input" placeholder="ARTIX-XXXXX-YYYYY-..." value={key} onChange={e=>setKey(e.target.value)} />
        </label>
        <div className="flex gap-2">
          <a className="btn btn-muted" href="/admin/keys">Voltar</a>
          <button className="btn btn-primary" disabled={busy} type="submit">Checar</button>
        </div>
      </form>
      {res && (
        <div className="card p-4 grid gap-2">
          <div className="text-sm text-slate-400">Resultado</div>
          <pre className="text-sm overflow-auto">{JSON.stringify(res, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
