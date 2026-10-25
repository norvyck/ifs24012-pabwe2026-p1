import { useEffect, useState } from 'react';
import VoteCounts from '../components/claims/VoteCounts';
import ErrorMessage from '../components/common/ErrorMessage';
import PrivatePage from '../components/common/PrivatePage';
import { statusLabels } from '../constants/claims';
import { api } from '../services/api';
import { formatDate } from '../utils/date';

export default function MyVotes({ user }) {
  const [votes, setVotes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/me/votes', { token: user.token })
      .then((result) => setVotes(result.votes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.token]);

  return (
    <PrivatePage eyebrow="SUARA SAYA" title="Riwayat suara">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? <div className="empty-state">Memuat riwayat suara...</div> : votes.length === 0 ? (
        <div className="empty-state">Kamu belum memberikan suara pada klaim.</div>
      ) : (
        <div className="private-list">
          {votes.map((vote) => (
            <a className="private-list-card" href={`/claims/${vote.claim_id}`} key={vote.id}>
              <div><h2>{vote.claim.title}</h2><p>Suaramu: <b>{statusLabels[vote.vote_type]}</b> · {formatDate(vote.voted_at)}</p></div>
              <div className="private-list-meta">
                <span className={`status-badge status-${vote.claim.status}`}>{statusLabels[vote.claim.status]}</span>
                <span>{vote.claim.total_votes} suara</span>
              </div>
              <VoteCounts votes={vote.claim.votes} />
            </a>
          ))}
        </div>
      )}
    </PrivatePage>
  );
}
