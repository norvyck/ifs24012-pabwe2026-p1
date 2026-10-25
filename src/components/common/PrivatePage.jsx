export default function PrivatePage({ eyebrow, title, children }) {
  return (
    <main className="page narrow">
      <div className="private-heading">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>Ruang pribadi untuk kontribusimu di TruthCheck.</p>
      </div>
      {children}
    </main>
  );
}
