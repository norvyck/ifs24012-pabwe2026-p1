export default function Header({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="/" aria-label="TruthCheck beranda">
          <span className="brand-mark">T</span>
          <span>truth<span className="brand-light">check</span></span>
        </a>
        <nav className="nav-links" aria-label="Navigasi utama">
          <a href="/">Jelajahi</a>
          {user && <a href="/submit">Kirim klaim</a>}
          {user && <a href="/dashboard">Klaim saya</a>}
          {user && <a href="/evidence">Tambah bukti</a>}
          {user && <a href="/votes">Riwayat suara</a>}
        </nav>
        <div className="nav-account">
          {user ? (
            <>
              <a className="user-name" href="/profile" title="Buka profil">Halo, {user.name}</a>
              <button className="button button-small button-outline" onClick={onLogout}>Keluar</button>
            </>
          ) : (
            <>
              <a className="nav-login" href="/auth/login">Masuk</a>
              <a className="button button-small" href="/auth/register">Daftar</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
