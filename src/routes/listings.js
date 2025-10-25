import { Router } from 'express';
import { configs } from '../state.js';

export const router = Router();

// In-memory listings demo store
const listings = [
  { id: 1, type: 'accommodation', title: '2-Bedroom House', location: 'Chipata', fenced: true, priceZMW: 4500, contactHidden: true, contact: { phone: '***', owner: 'TBD' } },
  { id: 2, type: 'car_hire', title: 'Toyota Corolla (Daily)', location: 'Lusaka', priceZMW: 900, contactHidden: true, contact: { phone: '***', owner: 'TBD' } },
  { id: 3, type: 'land', title: '2 Hectares Farm Plot', location: 'Petauke', priceZMW: 120000, contactHidden: true, contact: { phone: '***', owner: 'TBD' } },
];

router.get('/categories', (req, res) => res.json(configs.categories));

router.get('/', (req, res) => {
  res.json({ items: listings, viewingFeeZMW: configs.viewing_charges.unlock_fee_zmw });
});

router.post('/unlock/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = listings.find(l => l.id === id);
  if (!item) return res.status(404).json({ error: 'Listing not found' });
  // In production, verify payment txn before unlocking
  item.contactHidden = false;
  item.contact = { phone: '+260-XXX-XXXX', owner: 'Owner Name' };
  res.json({ ok: true, item });
});
