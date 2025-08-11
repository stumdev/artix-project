'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string };

const items: Item[] = [
  { href: '/admin/keys', label: 'Keys' },
  { href: '/admin/products', label: 'Produtos' },
  { href: '/admin/keygens', label: 'Keygens' },
  { href: '/admin/validate', label: 'Validar' },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-6 text-sm text-slate-300">
      {items.map((it) => {
        const active = pathname?.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className="relative px-1 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded"
          >
            <span className="">{it.label}</span>
            {/* underline */}
            <span
              aria-hidden
              className={[
                "pointer-events-none absolute left-0 right-0 -bottom-1 h-0.5 rounded-full transition-all",
                active ? "bg-accent scale-x-100" : "bg-accent/0 scale-x-0",
              ].join(" ")}
              style={{ transformOrigin: 'center' }}
            />
            {/* hover reveal when not active */}
            {!active && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-slate-500/40 scale-x-0 group-hover:scale-x-100 transition-transform"
                style={{ transformOrigin: 'center' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
