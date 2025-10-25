// backend/src/app.js  (ESM)
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { router as listingsRouter } from './routes/listings.js';
import { router as groupsRouter } from './routes/groups.js';
import { router as paymentsRouter } from './routes/payments.js';
import { router as uploadsRouter } from './routes/uploads.js';   // <-- add
import { router as legalRouter } from './routes/legal.js';       // <-- add

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true, service: 'reshenia' }));

// Prefix everything with /api
app.use('/api/listings', listingsRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/legal', legalRouter);
const PORT = process.env.PORT || 4001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Reshenia API] listening on http://localhost:${PORT}`);
});

