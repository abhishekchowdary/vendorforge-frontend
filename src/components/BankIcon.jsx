export default function BankIcon({ id, className = 'h-5 w-5' }) {
  if (!id) return <div className={`rounded bg-white/10 ${className}`} />;
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`#${id}`} />
    </svg>
  );
}
