'use client'
import { useEffect, useState } from "react";
import { Keygens, Keys } from "@/lib/api";

export default function CreateKeysPage() {
  const [keygens, setKeygens] = useState<any[]>([]);
  const [keygenId, setKeygenId] = useState<number | undefined>();
  const [count, setCount] = useState(1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      setKeygens(await Keygens.list());
    })();
  }, []);

  async function submit() {
    if (!keygenId) { alert("Selecione um keygen"); return; }
    setBusy(true);
    try {
      const r = await Keys.create({ keygen_id: keygenId, count });
      setResult(r);
    } finally { setBusy(false); }
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Criar Keys</h2>
      <div className="card p-4 grid sm:grid-cols-2 gap-4">
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Keygen</span>
          <select className="select" value={keygenId ?? ''} onChange={e => setKeygenId(Number(e.target.value))}>
            <option value="" disabled>Selecione...</option>
            {keygens.map((kg:any) => <option key={kg.id} value={kg.id}>{kg.name}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Quantidade</span>
          <input className="input" type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))} />
        </label>
      </div>
      <div className="flex gap-2">
        <a className="btn btn-muted" href="/admin/keys">Voltar</a>
        <button className="btn btn-primary" disabled={busy} onClick={submit}>Criar</button>
      </div>
      {result && (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Geradas</h3>
          <ul className="list-disc pl-6 space-y-1">
            {result.map((k:any) => <li key={k.id}><code>{k.code}</code></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
