import "./../styles/globals.css";
import Link from "next/link";

export const metadata = { title: "Artix Admin", description: "Painel de Administração" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <header className="border-b border-slate-800">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold">A</div>
              <div className="font-semibold">Painel de Administração</div>
            </div>
            <nav className="flex items-center gap-6 text-sm text-slate-300">
              <Link href="/admin/keys">Keys</Link>
              <Link href="/admin/products">Produtos</Link>
              <Link href="/admin/keygens">Keygens</Link>
                          <a href="/admin/validate">Validar</a>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
