import { useEffect, useState } from 'react';
import ErrorMessage from '../components/common/ErrorMessage';
import PrivatePage from '../components/common/PrivatePage';
import { api } from '../services/api';

export default function MyEvidence({ user }) {
  const [claims, setClaims] = useState([]);
  const [claimId, setClaimId] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/api/claims')
      .then((result) => {
        setClaims(result.claims);
        if (result.claims.length) setClaimId(String(result.claims[0].id));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await api(`/api/claims/${claimId}/evidence`, {
        method: 'POST',
        token: user.token,
        body: JSON.stringify({
          content,
          ...(sourceUrl.trim() ? { source_url: sourceUrl.trim() } : {}),
        }),
      });
      setContent('');
      setSourceUrl('');
      setNotice('Bukti berhasil ditambahkan.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PrivatePage eyebrow="KONTRIBUSI KOMUNITAS" title="Tambahkan bukti">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? <div className="empty-state">Memuat daftar klaim...</div> : claims.length === 0 ? (
        <div className="empty-state">Belum ada klaim yang bisa diberi bukti.</div>
      ) : (
        <form className="evidence-form private-form" onSubmit={submit}>
          <label htmlFor="evidence-claim">Pilih klaim</label>
          <select id="evidence-claim" required value={claimId} onChange={(event) => setClaimId(event.target.value)}>
            {claims.map((claim) => <option key={claim.id} value={claim.id}>{claim.title}</option>)}
          </select>
          <label htmlFor="private-evidence-content">Ringkasan bukti</label>
          <textarea id="private-evidence-content" maxLength="5000" required value={content} onChange={(event) => setContent(event.target.value)} placeholder="Jelaskan bukti yang relevan..." />
          <label htmlFor="private-evidence-url">Tautan sumber <span>(opsional)</span></label>
          <input id="private-evidence-url" type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://..." />
          {notice && <div className="form-success" role="status">{notice}</div>}
          <button className="button" disabled={busy}>{busy ? 'Mengirim...' : 'Kirim bukti'}</button>
        </form>
      )}
    </PrivatePage>
  );
}
