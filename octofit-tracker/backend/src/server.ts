import express from 'express';
import db from './config/database';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  const readyState = db.readyState;
  console.log(`OctoFit backend listening on port ${PORT} (Mongo readyState: ${readyState})`);
});
