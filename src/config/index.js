import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { configs } from '../state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadConfigs() {
  const base = path.resolve(__dirname, '../../config');
  const payments = JSON.parse(fs.readFileSync(path.join(base, 'payments.json'), 'utf8'));
  const languages = JSON.parse(fs.readFileSync(path.join(base, 'languages.json'), 'utf8'));
  const policies = JSON.parse(fs.readFileSync(path.join(base, 'policies.json'), 'utf8'));
  const viewing_charges = JSON.parse(fs.readFileSync(path.join(base, 'viewing_charges.json'), 'utf8'));
  const commission = JSON.parse(fs.readFileSync(path.join(base, 'commission.json'), 'utf8'));
  const categories = JSON.parse(fs.readFileSync(path.join(base, 'categories.json'), 'utf8'));

  const loaded = { payments, languages, policies, viewing_charges, commission, categories };
  Object.assign(configs, loaded);
  return loaded;
}
