import { NavLink, Route, Routes } from 'react-router-dom';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import { getApiBaseUrl } from './components/apiClient';

function App() {
  const navClassName = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-semibold text-dark' : 'text-secondary'}`;

  return (
    <div className="container py-4">
      <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <img src="/octofitapp-small.png" alt="OctoFit" width="48" height="48" />
          <div>
            <h1 className="h3 mb-1">OctoFit Tracker</h1>
            <p className="mb-0 text-muted">API base: {getApiBaseUrl()}</p>
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg bg-body-tertiary rounded px-3 mb-4">
        <ul className="navbar-nav gap-2">
          <li className="nav-item">
            <NavLink to="/users" className={navClassName}>
              Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/teams" className={navClassName}>
              Teams
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/activities" className={navClassName}>
              Activities
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/leaderboard" className={navClassName}>
              Leaderboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/workouts" className={navClassName}>
              Workouts
            </NavLink>
          </li>
        </ul>
      </nav>

      <main className="card shadow-sm">
        <div className="card-body">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
