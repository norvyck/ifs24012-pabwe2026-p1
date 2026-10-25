import { choices } from '../../constants/claims';

export default function VoteCounts({ votes }) {
  const totals = Object.fromEntries((votes || []).map((vote) => [vote.vote_type, vote.count]));
  return (
    <div className="vote-counts">
      {choices.map((choice) => (
        <span className={`vote-count ${choice.tone}`} key={choice.value}>
          {choice.label} <b>{totals[choice.value] || 0}</b>
        </span>
      ))}
    </div>
  );
}
