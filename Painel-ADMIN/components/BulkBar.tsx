'use client'
import { useState } from "react";
import { Keys } from "@/lib/api";

export default function BulkBar({ selected, onDone }: { selected: number[], onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  async function act(action: string) {
    setBusy(true);
    try {
      await Keys.bulk(action, selected);
      onDone();
    } finally {
      setBusy(false);
    }
  }
  if (!selected.length) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 card px-4 py-3 flex items-center gap-3 shadow-2xl">
      <div className="text-sm text-slate-300">{selected.length} selecionadas</div>
      <button className="btn" disabled={busy} onClick={() => act('reset')}>Resetar</button>
      <button className="btn btn-danger" disabled={busy} onClick={() => act('ban')}>Banir</button>
      <button className="btn" disabled={busy} onClick={() => act('unban')}>Desbanir</button>
      <button className="btn" disabled={busy} onClick={() => act('revoke')}>Revogar</button>
      <button className="btn btn-muted" disabled={busy} onClick={() => act('delete')}>Deletar</button>
    </div>
  );
}
