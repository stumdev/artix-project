'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Toolbar({ keygens }: { keygens: { id:number, name:string }[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get('q') || '');
  const [kg, setKg] = useState(sp.get('keygen_id') || '');
  const [st, setSt] = useState(sp.get('status') || '');

  function apply() {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (kg) p.set('keygen_id', kg);
    if (st) p.set('status', st);
    router.push(`/admin/keys?${p.toString()}`);
  }

  return (
    <div className="toolbar card p-4">
      <input className="input flex-1 min-w-64" placeholder="Buscar por código..." value={q} onChange={e => setQ(e.target.value)} />
      <select className="select" value={kg} onChange={e => setKg(e.target.value)}>
        <option value="">Todos keygens</option>
        {keygens.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
      </select>
      <select className="select" value={st} onChange={e => setSt(e.target.value)}>
        <option value="">Todos status</option>
        <option value="ACTIVE">active</option>
        <option value="BANNED">banned</option>
        <option value="REVOKED">revoked</option>
        <option value="EXPIRED">expired</option>
      </select>
      <button className="btn" onClick={apply}>Filtrar</button>
    </div>
  );
}
