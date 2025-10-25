import { Router } from 'express';
import fs from 'fs';
import path from 'path';

export const router = Router();

router.get('/terms', (req, res) => {
  try {
    const filePath = path.resolve(process.cwd(), 'legal/disclaimers.md');
    const md = fs.readFileSync(filePath, 'utf8');
    res.type('text/markdown').send(md);
  } catch (e) {
    res.status(500).type('text/plain').send('Terms unavailable');
  }
});
