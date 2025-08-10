export default function StatusBadge({ value }: { value: string }) {
  const v = (value || '').toUpperCase();
  const cls = v === 'ACTIVE' ? 'badge badge-green' :
              v === 'BANNED' ? 'badge badge-red' :
              v === 'REVOKED' ? 'badge badge-yellow' : 'badge badge-gray';
  return <span className={cls}>{value}</span>;
}
