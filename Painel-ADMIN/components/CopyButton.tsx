'use client'
export default function CopyButton({ text }: { text: string }) {
  return <button className="btn btn-muted" onClick={() => navigator.clipboard.writeText(text)}>Copiar</button>;
}
