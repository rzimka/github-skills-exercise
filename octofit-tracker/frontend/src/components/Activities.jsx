import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeApiPayload } from './apiClient';

const codespacesEndpointFormat = '-8000.app.github.dev/api/activities';


function Activities() {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    let cancelled = false;

    async function loadActivities() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(buildApiUrl('activities'));
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
          const fallbackMessage = `Unable to load activities. Expected Codespaces endpoint format: ${codespacesEndpointFormat}`;
          setError(fetchError instanceof Error ? fetchError.message : fallbackMessage);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2 className="h4">Activities</h2>
      {loading && <p>Loading activities...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div>
          <p className="text-muted">Total activities: {count}</p>
          <ul className="list-group">
            {items.map((activity) => (
              <li className="list-group-item" key={activity._id ?? activity.id}>
                <div className="fw-semibold text-capitalize">{activity.type ?? 'Activity'}</div>
                <div className="small text-muted">
                  {activity.durationMinutes ?? 0} min, {activity.caloriesBurned ?? 0} cal
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Activities;
