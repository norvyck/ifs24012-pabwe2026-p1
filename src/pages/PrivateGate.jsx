export default function PrivateGate({ route }) {
  return (
    <main className="page narrow">
      <div className="empty-state">
        Halaman ini hanya untuk pengguna yang masuk. <a className="text-link" href={`/auth/login?redirect=${encodeURIComponent(route)}`}>Masuk untuk melanjutkan</a>
      </div>
    </main>
  );
}
