import { useEffect, useState } from 'react';
import VoteCounts from '../components/claims/VoteCounts';
import ErrorMessage from '../components/common/ErrorMessage';
import PrivatePage from '../components/common/PrivatePage';
import { statusLabels } from '../constants/claims';
import { api } from '../services/api';

export default function MyClaims({ user }) {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/me/claims', { token: user.token })
      .then((result) => setClaims(result.claims))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.token]);

  return (
    <PrivatePage eyebrow="KONTRIBUSIMU" title="Klaim saya">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? <div className="empty-state">Memuat klaim...</div> : claims.length === 0 ? (
        <div className="empty-state">Kamu belum mengirim klaim. <a className="text-link" href="/submit">Kirim klaim pertama</a></div>
      ) : (
        <div className="private-list">
          {claims.map((claim) => (
            <a className="private-list-card" href={`/claims/${claim.id}`} key={claim.id}>
              <div><h2>{claim.title}</h2><p>{claim.description}</p></div>
              <div className="private-list-meta">
                <span className={`status-badge status-${claim.status}`}>{statusLabels[claim.status]}</span>
                <span>{claim.total_votes} suara</span>
              </div>
              <VoteCounts votes={claim.votes} />
            </a>
          ))}
        </div>
      )}
    </PrivatePage>
  );
}
