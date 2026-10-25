import { statusLabels } from '../constants/claims';
import VoteCounts from '../components/claims/VoteCounts';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatDate } from '../utils/date';

export default function ClaimList({ claims, loading, error, user }) {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> INFORMASI LEBIH JERNIH, BERSAMA</div>
          <h1>Periksa klaim.<br /><span>Temukan faktanya.</span></h1>
          <p>Ruang kolaboratif untuk menguji informasi lewat bukti dan penilaian komunitas.</p>
          <a className="button hero-button" href={user ? '/submit' : '/auth/login?redirect=%2Fsubmit'}>Mulai kirim klaim <span>↗</span></a>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-stamp"><span>✓</span></div>
          <div className="float-card card-top"><span className="mini-icon green">✓</span><div><b>Fakta diperiksa</b><small>bersama komunitas</small></div></div>
          <div className="float-card card-bottom"><span className="mini-icon amber">✳</span><div><b>Bukti terbuka</b><small>untuk semua orang</small></div></div>
          <span className="sparkle sparkle-one">✳</span>
          <span className="sparkle sparkle-two">✦</span>
        </div>
      </section>

      <section className="claims-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">RUANG DISKUSI</div>
            <h2>Klaim terbaru</h2>
          </div>
          <span className="claim-count">{claims.length} klaim</span>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading ? (
          <div className="empty-state">Memuat klaim...</div>
        ) : claims.length === 0 ? (
          <div className="empty-state">Belum ada klaim. Jadilah yang pertama membagikan klaim untuk diperiksa.</div>
        ) : (
          <div className="claim-grid">
            {claims.map((claim) => (
              <a className="claim-card" href={`/claims/${claim.id}`} key={claim.id}>
                <div className="claim-card-top">
                  <span className="claim-tag">KLAIM KOMUNITAS</span>
                  <span className="card-arrow">↗</span>
                </div>
                <h3>{claim.title}</h3>
                <p>{claim.description}</p>
                <div className="claim-vote-summary">
                  <span className={`status-badge status-${claim.status}`}>
                    {statusLabels[claim.status] || statusLabels.belum_terbukti}
                  </span>
                  <span className="total-votes">{claim.total_votes} suara</span>
                </div>
                <VoteCounts votes={claim.votes} />
                <div className="claim-card-footer">
                  <span className="author-avatar">{claim.author?.charAt(0)?.toUpperCase() || '?'}</span>
                  <span>{claim.author || 'Pengguna'}</span>
                  <span className="footer-divider">·</span>
                  <span>{formatDate(claim.created_at)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
