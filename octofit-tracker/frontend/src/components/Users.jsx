import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeApiPayload } from './apiClient';

const codespacesEndpointFormat = '-8000.app.github.dev/api/users';

function Users() {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(buildApiUrl('users'));
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
          const fallbackMessage = `Unable to load users. Expected Codespaces endpoint format: ${codespacesEndpointFormat}`;
          setError(fetchError instanceof Error ? fetchError.message : fallbackMessage);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2 className="h4">Users</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div>
          <p className="text-muted">Total users: {count}</p>
          <ul className="list-group">
            {items.map((user) => (
              <li className="list-group-item" key={user._id ?? user.id ?? user.email}>
                <strong>{user.name ?? 'Unknown'}</strong>
                <div className="small text-muted">{user.email ?? 'No email'}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Users;
