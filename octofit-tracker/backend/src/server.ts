import express from 'express';
import db from './config/database';
import User from './models/User';
import Team from './models/Team';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Workout from './models/Workout';

const app = express();
const PORT = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', apiBaseUrl });
});

app.get('/api/users/', async (_req, res) => {
  try {
    const users = await User.find().populate('team', 'name').lean();
    res.json({
      resource: 'users',
      baseUrl: apiBaseUrl,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ resource: 'users', message: 'Failed to fetch users', error });
  }
});

app.get('/api/teams/', async (_req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email').lean();
    res.json({
      resource: 'teams',
      baseUrl: apiBaseUrl,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({ resource: 'teams', message: 'Failed to fetch teams', error });
  }
});

app.get('/api/activities/', async (_req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name')
      .populate('team', 'name')
      .sort({ performedAt: -1 })
      .lean();
    res.json({
      resource: 'activities',
      baseUrl: apiBaseUrl,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ resource: 'activities', message: 'Failed to fetch activities', error });
  }
});

app.get('/api/leaderboard/', async (_req, res) => {
  try {
    const leaderboard = await Leaderboard.find().populate('entries.user', 'name').lean();
    res.json({
      resource: 'leaderboard',
      baseUrl: apiBaseUrl,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({ resource: 'leaderboard', message: 'Failed to fetch leaderboard', error });
  }
});

app.get('/api/workouts/', async (_req, res) => {
  try {
    const workouts = await Workout.find().lean();
    res.json({
      resource: 'workouts',
      baseUrl: apiBaseUrl,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    res.status(500).json({ resource: 'workouts', message: 'Failed to fetch workouts', error });
  }
});

app.listen(PORT, () => {
  const readyState = db.readyState;
  console.log(`OctoFit backend listening on port ${PORT} (Mongo readyState: ${readyState})`);
  console.log(`API base URL: ${apiBaseUrl}`);
});
