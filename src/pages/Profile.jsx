import PrivatePage from '../components/common/PrivatePage';

export default function Profile({ user }) {
  return (
    <PrivatePage eyebrow="AKUN" title="Profil saya">
      <section className="profile-card">
        <span className="profile-avatar">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
        <div><h2>{user.name}</h2><p>{user.email}</p></div>
      </section>
      <nav className="profile-links" aria-label="Halaman pribadi">
        <a href="/submit">Kirim klaim <span>↗</span></a>
        <a href="/dashboard">Lihat klaim saya <span>↗</span></a>
        <a href="/evidence">Tambahkan bukti <span>↗</span></a>
        <a href="/votes">Riwayat suara <span>↗</span></a>
      </nav>
    </PrivatePage>
  );
}
