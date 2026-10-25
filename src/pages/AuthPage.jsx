import { useState } from 'react';
import ErrorMessage from '../components/common/ErrorMessage';
import { api } from '../services/api';

export default function AuthPage({ mode, onAuthenticated }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const usernameVal = event.target.elements.username?.value || form.email;
    const passwordVal = event.target.elements.password?.value || form.password;
    try {
      const response = await api(`/api/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          email: usernameVal,
          username: usernameVal,
          password: passwordVal,
        }),
      });
      onAuthenticated(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-decoration"><span className="auth-star">✳</span><span className="auth-orbit" /><span className="auth-quote">“Informasi yang baik<br />dimulai dari rasa ingin tahu.”</span></div>
      <section className="auth-card">
        <a className="back-link" href="/">← Kembali</a>
        <div className="eyebrow">{isRegister ? 'BERGABUNG DENGAN KOMUNITAS' : 'SENANG MELIHATMU KEMBALI'}</div>
        <h1>{isRegister ? 'Buat akun' : 'Masuk ke akun'}</h1>
        <p className="auth-intro">{isRegister ? 'Mari ikut membangun ruang informasi yang lebih jernih.' : 'Lanjutkan kontribusimu untuk informasi yang lebih baik.'}</p>
        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <>
              <label htmlFor="name">Nama</label>
              <input id="name" name="name" autoComplete="name" maxLength="100" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nama lengkap" />
            </>
          )}
          <label htmlFor="username">Email / Username</label>
          <input id="username" name="username" type="text" autoComplete="username email" maxLength="254" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="nama@email.com atau username" />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 8 : undefined} maxLength="128" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={isRegister ? 'Minimal 8 karakter' : 'Masukkan password'} />
          <ErrorMessage>{error}</ErrorMessage>
          <button id="btn-submit" type="submit" className="button auth-submit" disabled={busy}>{busy ? 'Memproses...' : isRegister ? 'Buat akun' : 'Masuk'}</button>
        </form>
        <p className="auth-switch">{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} <a href={isRegister ? '/auth/login' : '/auth/register'}>{isRegister ? 'Masuk' : 'Daftar sekarang'}</a></p>
      </section>
    </main>
  );
}
