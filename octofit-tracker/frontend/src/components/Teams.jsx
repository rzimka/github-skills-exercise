import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeApiPayload } from './apiClient';

function Teams() {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTeams() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(buildApiUrl('teams'));
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
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load teams');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTeams();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2 className="h4">Teams</h2>
      {loading && <p>Loading teams...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div>
          <p className="text-muted">Total teams: {count}</p>
          <ul className="list-group">
            {items.map((team) => (
              <li className="list-group-item" key={team._id ?? team.id ?? team.name}>
                <strong>{team.name ?? 'Unnamed Team'}</strong>
                <div className="small text-muted">Weekly points: {team.weeklyPoints ?? 0}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Teams;
