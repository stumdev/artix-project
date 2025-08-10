export default function Home() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Artix Admin</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4"><div className="text-sm text-slate-400">Receita (30d)</div><div className="text-2xl font-bold">R$ 0,00</div></div>
        <div className="card p-4"><div className="text-sm text-slate-400">Pedidos</div><div className="text-2xl font-bold">0</div></div>
        <div className="card p-4"><div className="text-sm text-slate-400">Keys ativas</div><div className="text-2xl font-bold">0</div></div>
        <div className="card p-4"><div className="text-sm text-slate-400">Chargebacks</div><div className="text-2xl font-bold">0</div></div>
      </div>
    </div>
  );
}
