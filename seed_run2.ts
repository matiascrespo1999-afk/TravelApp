import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const batch = writeBatch(db);
  const cities = [
    { code: 'ROMA', name: 'Roma', country: 'Italia', currency: 'EUR', symbol: '€', tz: 'Europe/Rome', lat: 41.9028, lng: 12.4964, primary: '#ea580c', secondary: '#eab308' },
    { code: 'LONDRES', name: 'Londres', country: 'Reino Unido', currency: 'GBP', symbol: '£', tz: 'Europe/London', lat: 51.5074, lng: -0.1278, primary: '#1e40af', secondary: '#dc2626' },
    { code: 'OXFORD', name: 'Oxford', country: 'Reino Unido', currency: 'GBP', symbol: '£', tz: 'Europe/London', lat: 51.7520, lng: -1.2577, primary: '#1e3a8a', secondary: '#991b1b' },
    { code: 'BARCELONA', name: 'Barcelona', country: 'España', currency: 'EUR', symbol: '€', tz: 'Europe/Madrid', lat: 41.3879, lng: 2.1699, primary: '#0891b2', secondary: '#f59e0b' },
    { code: 'GIRONA', name: 'Girona', country: 'España', currency: 'EUR', symbol: '€', tz: 'Europe/Madrid', lat: 41.9794, lng: 2.8214, primary: '#0e7490', secondary: '#d97706' },
    { code: 'MADRID', name: 'Madrid', country: 'España', currency: 'EUR', symbol: '€', tz: 'Europe/Madrid', lat: 40.4168, lng: -3.7038, primary: '#b91c1c', secondary: '#f97316' },
    { code: 'TOLEDO', name: 'Toledo', country: 'España', currency: 'EUR', symbol: '€', tz: 'Europe/Madrid', lat: 39.8628, lng: -4.0273, primary: '#991b1b', secondary: '#ea580c' },
    { code: 'EZEIZA', name: 'Buenos Aires', country: 'Argentina', currency: 'USD', symbol: '$', tz: 'America/Argentina/Buenos_Aires', lat: -34.8222, lng: -58.5358, primary: '#0284c7', secondary: '#f59e0b' },
    { code: 'TRANSITO', name: 'Tránsito / Vuelo', country: 'Global', currency: 'USD', symbol: '$', tz: 'UTC', lat: 0, lng: 0, primary: '#6366f1', secondary: '#0ea5e9' }
  ];

  for (const c of cities) {
    batch.set(doc(db, 'trips/TRIP_CURRENT/destinations', c.code), {
      id: c.code,
      code: c.code,
      name: c.name,
      country: c.country,
      currency: c.currency,
      timezone: c.tz,
      coordinates: { lat: c.lat, lng: c.lng },
      gradientStops: [c.primary, c.secondary],
      flagEmoji: c.country === 'Italia' ? '🇮🇹' : c.country === 'Reino Unido' ? '🇬🇧' : c.country === 'España' ? '🇪🇸' : c.country === 'Argentina' ? '🇦🇷' : '✈️'
    });
  }

  await batch.commit();
  console.log('Batch 2 committed!');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
