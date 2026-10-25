import { useState } from 'react';
import ErrorMessage from '../components/common/ErrorMessage';
import { api } from '../services/api';
import { navigate } from '../hooks/useNavigation';

export default function SubmitClaim({ user }) {
  const [form, setForm] = useState({ title: '', description: '', source_url: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await api('/api/claims', {
        method: 'POST',
        token: user.token,
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          ...(form.source_url.trim() ? { source_url: form.source_url.trim() } : {}),
        }),
      });
      navigate(`/claims/${response.claim.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page narrow">
      <a className="back-link" href="/">← Semua klaim</a>
      <section className="form-card">
        <div className="eyebrow">MULAI DISKUSI</div>
        <h1>Kirim sebuah klaim</h1>
        <p className="auth-intro">Bagikan informasi yang ingin diperiksa. Komunitas dapat membantu menambahkan bukti dan penilaian.</p>
        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="claim-title">Judul klaim</label>
          <input id="claim-title" maxLength="200" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Tulis klaim secara ringkas" />
          <label htmlFor="claim-description">Konteks klaim</label>
          <textarea id="claim-description" maxLength="5000" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Dari mana klaim ini berasal? Tambahkan konteks..." />
          <label htmlFor="claim-source">Tautan sumber <span>(opsional)</span></label>
          <input id="claim-source" type="url" value={form.source_url} onChange={(event) => setForm({ ...form, source_url: event.target.value })} placeholder="https://..." />
          <ErrorMessage>{error}</ErrorMessage>
          <button className="button auth-submit" disabled={busy}>{busy ? 'Mengirim...' : 'Kirim klaim'}</button>
        </form>
      </section>
    </main>
  );
}
