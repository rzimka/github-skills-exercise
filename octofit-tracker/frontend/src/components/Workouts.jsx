import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeApiPayload } from './apiClient';

function Workouts() {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadWorkouts() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(buildApiUrl('workouts'));
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
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load workouts');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2 className="h4">Workouts</h2>
      {loading && <p>Loading workouts...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div>
          <p className="text-muted">Total workouts: {count}</p>
          <ul className="list-group">
            {items.map((workout) => (
              <li className="list-group-item" key={workout._id ?? workout.id ?? workout.title}>
                <strong>{workout.title ?? 'Workout'}</strong>
                <div className="small text-muted">
                  {workout.intensity ?? 'n/a'} intensity, {workout.durationMinutes ?? 0} minutes
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Workouts;
