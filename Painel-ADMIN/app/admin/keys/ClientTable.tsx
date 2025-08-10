'use client'
import { useMemo, useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import CopyButton from "@/components/CopyButton";
import { Keys as KeysAPI } from "@/lib/api";
import BulkBar from "@/components/BulkBar";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-800/90 border border-slate-700 px-4 py-2 shadow">
      <span className="text-sm text-slate-200">{message}</span>
    </div>
  );
}

export default function ClientTable({ data, keygens }: { data: any, keygens: any[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [items] = useState<any[]>(data.items);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const kgMap = useMemo(() => Object.fromEntries((keygens||[]).map((k:any) => [k.id, k.name])), [keygens]);

  function toggle(id: number) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function actionSingle(id: number, action: 'ban'|'unban'|'reset'|'revoke'|'delete') {
    const call = { ban: KeysAPI.ban, unban: KeysAPI.unban, reset: KeysAPI.reset, revoke: KeysAPI.revoke, delete: KeysAPI.del }[action];
    setPendingId(id);
    try {
      await call(id);
      setToast(action === 'reset' ? 'Key resetada com sucesso' : 'Ação concluída');
    } catch (e: any) {
      setToast('Erro: ' + (e?.message || 'falha na ação'));
    } finally {
      setPendingId(null);
      setTimeout(() => location.reload(), 500);
    }
  }

  return (
    <div className="card p-4 overflow-x-auto">
      <table className="table">
        <thead><tr>
          <th></th>
          <th>Código</th>
          <th>Status</th>
          <th>Keygen</th>
          <th>Usuário</th>
          <th>IP</th>
          <th>Ações</th>
        </tr></thead>
        <tbody>
          {items.map((k:any) => (
            <tr key={k.id} className="hover:bg-slate-900/30">
              <td><input type="checkbox" checked={selected.includes(k.id)} onChange={() => toggle(k.id)} /></td>
              <td className="flex items-center gap-2"><code className="text-slate-300">{k.code}</code><CopyButton text={k.code} /></td>
              <td><StatusBadge value={k.status} /></td>
              <td>{kgMap[k.keygen_id] ?? (k.keygen_id ?? '-')}</td>
              <td>{k.user_email ?? '-'}</td>
              <td>{k.last_ip ?? '-'}</td>
              <td className="flex gap-2">
                <button className="btn" disabled={pendingId===k.id} onClick={() => actionSingle(k.id,'reset')}>{pendingId===k.id? '...' : 'Resetar'}</button>
                {k.status !== 'BANNED' ? (
                  <button className="btn btn-danger" disabled={pendingId===k.id} onClick={() => actionSingle(k.id,'ban')}>{pendingId===k.id? '...' : 'Banir'}</button>
                ) : (
                  <button className="btn" disabled={pendingId===k.id} onClick={() => actionSingle(k.id,'unban')}>{pendingId===k.id? '...' : 'Desbanir'}</button>
                )}
                <button className="btn btn-muted" disabled={pendingId===k.id} onClick={() => actionSingle(k.id,'delete')}>{pendingId===k.id? '...' : 'Deletar'}</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (<tr><td colSpan={7} className="text-center text-slate-400 py-8">Sem resultados</td></tr>)}
        </tbody>
      </table>
      <BulkBar selected={selected} onDone={() => location.reload()} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
