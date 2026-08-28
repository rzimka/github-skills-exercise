import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeApiPayload } from './apiClient';

function Leaderboard() {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(buildApiUrl('leaderboard'));
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = normalizeApiPayload(payload);

        if (!cancelled) {
          setItems(normalized.items);
          setCount(normalized.count);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load leaderboard');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2 className="h4">Leaderboard</h2>
      {loading && <p>Loading leaderboard...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div>
          <p className="text-muted">Total periods: {count}</p>
          <ul className="list-group">
            {items.map((period) => (
              <li className="list-group-item" key={period._id ?? period.id ?? period.periodLabel}>
                <strong>{period.periodLabel ?? 'Leaderboard period'}</strong>
                <div className="small text-muted">
                  Entries: {Array.isArray(period.entries) ? period.entries.length : 0}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Leaderboard;
