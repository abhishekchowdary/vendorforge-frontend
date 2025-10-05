export default function Card({ title, children, actions }) {
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="text-sm text-gray-300">{children}</div>
    </section>
  );
}
