import { useCallback, useEffect, useState } from 'react';
import { choices, statusLabels } from '../constants/claims';
import ErrorMessage from '../components/common/ErrorMessage';
import { api } from '../services/api';
import { formatDate } from '../utils/date';

export default function ClaimDetail({ id, user, onRequireLogin }) {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api(`/api/claims/${id}`);
      setClaim(result.claim);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function vote(voteType) {
    if (!user) {
      onRequireLogin();
      return;
    }
    setBusy(true);
    setNotice('');
    setError('');
    try {
      await api(`/api/claims/${id}/votes`, {
        method: 'POST',
        token: user.token,
        body: JSON.stringify({ vote_type: voteType }),
      });
      setNotice('Suara berhasil dicatat. Terima kasih sudah berpartisipasi.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function addEvidence(event) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    setError('');
    try {
      await api(`/api/claims/${id}/evidence`, {
        method: 'POST',
        token: user.token,
        body: JSON.stringify({
          content: evidenceText,
          ...(evidenceUrl.trim() ? { source_url: evidenceUrl.trim() } : {}),
        }),
      });
      setEvidenceText('');
      setEvidenceUrl('');
      setNotice('Bukti berhasil ditambahkan.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="page narrow"><div className="empty-state">Memuat detail klaim...</div></main>;
  if (error && !claim) return <main className="page narrow"><ErrorMessage>{error}</ErrorMessage><a className="text-link" href="/">← Kembali ke daftar</a></main>;

  const voteTotals = Object.fromEntries((claim.votes || []).map((item) => [item.vote_type, item.count]));

  return (
    <main className="page narrow">
      <a className="back-link" href="/">← Semua klaim</a>
      <article className="detail-card">
        <div className="eyebrow">KLAIM KOMUNITAS</div>
        <h1>{claim.title}</h1>
        <div className="detail-byline">
          <span className="author-avatar">{claim.author?.charAt(0)?.toUpperCase() || '?'}</span>
          <span>Dikirim oleh <b>{claim.author}</b></span><span>·</span><span>{formatDate(claim.created_at)}</span>
        </div>
        <div className="detail-status">
          <span className={`status-badge status-${claim.status}`}>
            {statusLabels[claim.status] || statusLabels.belum_terbukti}
          </span>
          <span>{claim.total_votes} suara terkumpul</span>
        </div>
        <p className="detail-description">{claim.description}</p>
        {claim.source_url && <a className="source-link" href={claim.source_url} target="_blank" rel="noreferrer">Lihat sumber klaim ↗</a>}
        <div className="vote-panel">
          <div className="vote-panel-heading"><h2>Apa penilaianmu?</h2><span>Suaramu membantu komunitas</span></div>
          <div className="vote-options">
            {choices.map((choice) => (
              <button
                className={`vote-button ${choice.tone}`}
                disabled={busy}
                key={choice.value}
                onClick={() => vote(choice.value)}
              >
                <span className={`vote-icon ${choice.tone}`}>{choice.icon}</span>
                <span>{choice.label}</span>
                <b>{voteTotals[choice.value] || 0}</b>
              </button>
            ))}
          </div>
          {!user && <p className="muted-note">Masuk untuk memberikan suara.</p>}
          <p className="muted-note">Status ditentukan mulai 5 suara. Jika suara terbanyak imbang, klaim tetap belum terbukti.</p>
        </div>
        <ErrorMessage>{error}</ErrorMessage>
        {notice && <div className="form-success" role="status">{notice}</div>}
      </article>

      <section className="evidence-section">
        <div className="section-heading">
          <div><div className="eyebrow">REFERENSI &amp; SUMBER</div><h2>Bukti pendukung</h2></div>
          <span className="claim-count">{claim.evidence?.length || 0} bukti</span>
        </div>
        {claim.evidence?.length ? (
          <div className="evidence-list">
            {claim.evidence.map((item) => (
              <article className="evidence-card" key={item.id}>
                <span className="evidence-mark">↗</span>
                <div><p>{item.content}</p>
                  <div className="evidence-meta">{item.author} · {formatDate(item.created_at)}
                    {item.source_url && <> · <a href={item.source_url} target="_blank" rel="noreferrer">Buka sumber</a></>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state">Belum ada bukti. Tambahkan sumber yang bisa membantu memeriksa klaim ini.</div>}

        {user ? (
          <form className="evidence-form" onSubmit={addEvidence}>
            <h3>Tambahkan bukti</h3>
            <label htmlFor="evidence-content">Ringkasan bukti</label>
            <textarea id="evidence-content" maxLength="5000" required value={evidenceText} onChange={(event) => setEvidenceText(event.target.value)} placeholder="Jelaskan bukti atau informasi yang relevan..." />
            <label htmlFor="evidence-url">Tautan sumber <span>(opsional)</span></label>
            <input id="evidence-url" type="url" value={evidenceUrl} onChange={(event) => setEvidenceUrl(event.target.value)} placeholder="https://..." />
            <button className="button" disabled={busy}>{busy ? 'Mengirim...' : 'Kirim bukti'}</button>
          </form>
        ) : <div className="login-hint">Ingin menambahkan bukti? <a href="/auth/login">Masuk ke akunmu</a></div>}
      </section>
    </main>
  );
}
