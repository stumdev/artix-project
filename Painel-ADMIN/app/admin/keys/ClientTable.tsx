  'use client'
  import { useMemo, useState, useEffect } from "react";
  import { ClipboardIcon } from "@heroicons/react/24/outline";
  import StatusBadge from "@/components/StatusBadge";
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

  function CopyButton({ text, onCopied }: { text: string; onCopied: () => void }) {
    return (
      <button
        onClick={() => {
          navigator.clipboard.writeText(text);
          onCopied();
        }}
        className="btn flex items-center gap-1 pl-2"
      >
        <ClipboardIcon className="h-4 w-4" />
        Copiar
      </button>
    );
  }

  export default function ClientTable({ data, keygens }: { data: any, keygens: any[] }) {
    const [selected, setSelected] = useState<number[]>([]);
    const [items] = useState<any[]>(data.items);
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const kgMap = useMemo(() => Object.fromEntries((keygens || []).map((k: any) => [k.id, k.name])), [keygens]);

    function toggle(id: number) {
      setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }

    async function actionSingle(id: number, action: 'ban' | 'unban' | 'reset' | 'revoke' | 'delete') {
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
        <table className="table table-fixed">
          <colgroup>
            <col style={{ width: 28 }} />
            <col />{/* Código */}
            <col style={{ width: 110 }} />{/* Status */}
            <col style={{ width: 140 }} />{/* Keygen */}
            <col style={{ width: 140 }} />{/* Usuário */}
            <col style={{ width: 120 }} />{/* IP */}
            <col style={{ width: 220 }} />{/* Ações */}
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>Código</th>
              <th>Status</th>
              <th>Keygen</th>
              <th>Usuário</th>
              <th>IP</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((k: any) => (
              <tr key={k.id} className="hover:bg-slate-900/30">
                <td className="py-3 align-middle">
                  <input type="checkbox" checked={selected.includes(k.id)} onChange={() => toggle(k.id)} />
                </td>
                <td className="py-3 align-middle">
                  <div className="flex items-center gap-3 min-w-0">
                    <code className="truncate text-slate-300 max-w-[340px] sm:max-w-[420px]">
                      {k.code}
                    </code>
                    <div className="shrink-0">
                      <CopyButton
                        text={k.code}
                        onCopied={() => setToast('Copiado para a área de transferência')}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 align-middle">
                  <div className="flex items-center">
                    <StatusBadge value={k.status} />
                  </div>
                </td>
                <td className="py-3 align-middle text-sm text-slate-300">{kgMap[k.keygen_id] ?? (k.keygen_id ?? '-')}</td>
                <td className="py-3 align-middle text-sm text-slate-400">{k.user_email ?? '-'}</td>
                <td className="py-3 align-middle text-sm text-slate-400 text-center">{k.last_ip ?? '-'}</td>
                <td className="py-3 align-middle">
                  <div className="flex justify-end gap-2">
                    <button className="btn" disabled={pendingId === k.id} onClick={() => actionSingle(k.id, 'reset')}>{pendingId === k.id ? '...' : 'Resetar'}</button>
                    {k.status !== 'BANNED' ? (
                      <button className="btn btn-danger" disabled={pendingId === k.id} onClick={() => actionSingle(k.id, 'ban')}>{pendingId === k.id ? '...' : 'Banir'}</button>
                    ) : (
                      <button className="btn" disabled={pendingId === k.id} onClick={() => actionSingle(k.id, 'unban')}>{pendingId === k.id ? '...' : 'Desbanir'}</button>
                    )}
                    <button className="btn btn-muted" disabled={pendingId === k.id} onClick={() => actionSingle(k.id, 'delete')}>{pendingId === k.id ? '...' : 'Deletar'}</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-8">Sem resultados</td>
              </tr>
            )}
          </tbody>
        </table>
        <BulkBar selected={selected} onDone={() => location.reload()} />
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }
