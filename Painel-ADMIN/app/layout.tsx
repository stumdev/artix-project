import "./../styles/globals.css";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";

export const metadata = {
  title: "Artix Admin",
  description: "Painel de Administração",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <header className="border-b border-slate-800">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Artix"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="font-semibold">Painel de Administração</div>
            </div>
            <AdminNav />
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
