import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const batch = writeBatch(db);
  const expenses = [
    { id: 'EXP_PRE_01', d: '2026-08-01', c: 'Roma', cat: 'Estadía', desc: 'Estadía Roma', p: 'USR_01', usd: 345.00, m: 172.50, a: 172.50 },
    { id: 'EXP_PRE_02', d: '2026-08-01', c: 'Londres', cat: 'Estadía', desc: 'Estadía Londres', p: 'USR_01', usd: 443.18, m: 221.59, a: 221.59 },
    { id: 'EXP_PRE_03', d: '2026-08-01', c: 'Barcelona', cat: 'Estadía', desc: 'Estadía Barcelona', p: 'USR_01', usd: 253.06, m: 126.53, a: 126.53 },
    { id: 'EXP_PRE_04', d: '2026-08-01', c: 'Madrid', cat: 'Estadía', desc: 'Estadía Madrid', p: 'USR_01', usd: 593.45, m: 296.73, a: 296.73 },
    { id: 'EXP_PRE_05', d: '2026-09-29', c: 'Buenos Aires', cat: 'Transporte', desc: 'Vuelo BUE-MAD (Plus Ultra PU502)', p: 'USR_02', usd: 1383.12, m: 691.56, a: 691.56 },
    { id: 'EXP_PRE_06', d: '2026-09-30', c: 'Madrid', cat: 'Transporte', desc: 'Vuelo MAD-ROM (Iberia IB649)', p: 'USR_02', usd: 120.00, m: 60.00, a: 60.00 },
    { id: 'EXP_PRE_07', d: '2026-10-03', c: 'Roma', cat: 'Transporte', desc: 'Vuelo ROM-LON (Wizz Air W46005)', p: 'USR_02', usd: 76.44, m: 38.22, a: 38.22 },
    { id: 'EXP_PRE_08', d: '2026-10-08', c: 'Londres', cat: 'Transporte', desc: 'Vuelo LON-BCN (Wizz Air W95359)', p: 'USR_02', usd: 51.70, m: 25.85, a: 25.85 },
    { id: 'EXP_PRE_09', d: '2026-10-10', c: 'Barcelona', cat: 'Transporte', desc: 'Tren BCN-MAD (Ouigo 06610)', p: 'USR_01', usd: 79.83, m: 39.92, a: 39.92 },
    { id: 'EXP_PRE_10', d: '2026-10-01', c: 'Roma', cat: 'Excursiones', desc: 'Coliseo, Foro y Palatino (Reserva OCO4690893)', p: 'USR_01', usd: 39.60, m: 19.80, a: 19.80 },
    { id: 'EXP_PRE_11', d: '2026-10-02', c: 'Roma', cat: 'Excursiones', desc: 'Museos Vaticanos y Sixtina', p: 'USR_01', usd: 55.00, m: 27.50, a: 27.50 },
    { id: 'EXP_PRE_12', d: '2026-10-02', c: 'Roma', cat: 'Excursiones', desc: 'Castel Sant\'Angelo', p: 'USR_01', usd: 39.60, m: 19.80, a: 19.80 },
    { id: 'EXP_PRE_13', d: '2026-10-05', c: 'Londres', cat: 'Excursiones', desc: 'British Museum', p: 'USR_01', usd: 7.80, m: 3.90, a: 3.90 },
    { id: 'EXP_PRE_14', d: '2026-10-07', c: 'Londres', cat: 'Excursiones', desc: 'Warner Bros Studios Harry Potter', p: 'USR_01', usd: 141.24, m: 70.62, a: 70.62 },
    { id: 'EXP_PRE_15', d: '2026-10-09', c: 'Barcelona', cat: 'Excursiones', desc: 'Sagrada Família con Torre', p: 'USR_01', usd: 79.20, m: 39.60, a: 39.60 },
    { id: 'EXP_PRE_16', d: '2026-10-09', c: 'Barcelona', cat: 'Excursiones', desc: 'Park Güell', p: 'USR_01', usd: 22.00, m: 11.00, a: 11.00 },
    { id: 'EXP_PRE_17', d: '2026-10-11', c: 'Madrid', cat: 'Excursiones', desc: 'Palacio Real de Madrid', p: 'USR_01', usd: 30.80, m: 15.40, a: 15.40 },
    { id: 'EXP_PRE_18', d: '2026-10-11', c: 'Madrid', cat: 'Excursiones', desc: 'Museo Nacional del Prado', p: 'USR_01', usd: 38.50, m: 19.25, a: 19.25 },
    { id: 'EXP_PRE_19', d: '2026-10-13', c: 'Madrid', cat: 'Excursiones', desc: 'Museo Arqueológico Nacional MAN', p: 'USR_01', usd: 6.60, m: 3.30, a: 3.30 },
    { id: 'EXP_PRE_20', d: '2026-09-10', c: 'Roma', cat: 'Excursiones', desc: 'Suplemento Sitios SUPER Foro y Palatino', p: 'USR_01', usd: 8.80, m: 4.40, a: 4.40 },
    { id: 'EXP_PRE_21', d: '2026-09-14', c: 'Barcelona', cat: 'Transporte', desc: 'Tren Renfe Avant Barcelona ➔ Girona', p: 'USR_01', usd: 62.70, m: 31.35, a: 31.35 },
    { id: 'EXP_PRE_22', d: '2026-09-14', c: 'Londres', cat: 'Transporte', desc: 'Tren Thameslink + DART London Bridge ➔ Aeropuerto Luton', p: 'USR_01', usd: 36.21, m: 18.11, a: 18.10 },
    { id: 'EXP_PRE_23', d: '2026-09-14', c: 'Londres', cat: 'Excursiones', desc: 'Entradas Natural History Museum Londres', p: 'USR_01', usd: 0.00, m: 0.00, a: 0.00 },
    { id: 'EXP_PRE_24', d: '2026-09-14', c: 'Londres', cat: 'Excursiones', desc: 'Entradas Sky Garden Londres', p: 'USR_01', usd: 0.00, m: 0.00, a: 0.00 },
    { id: 'EXP_PRE_25', d: '2026-09-14', c: 'Londres', cat: 'Transporte', desc: 'Trenes a Oxford Ida y Vuelta (GWR + Chiltern)', p: 'USR_01', usd: 83.96, m: 41.98, a: 41.98 }
  ];

  for (const e of expenses) {
    batch.set(doc(db, 'trips/TRIP_CURRENT/expenses', e.id), {
      id: e.id,
      date: e.d,
      cityCode: e.c === 'Buenos Aires' ? 'EZEIZA' : e.c.toUpperCase(),
      categoryId: e.cat.toUpperCase(),
      description: e.desc,
      paidByUserId: e.p,
      splitModeId: 'EQUITATIVO',
      currency: 'USD',
      realUsdAmount: e.usd,
      calculatedUsdAmount: e.usd,
      originalAmount: e.usd,
      splits: [
        { userId: 'USR_01', assignedUsdAmount: e.m, percentage: 50 },
        { userId: 'USR_02', assignedUsdAmount: e.a, percentage: 50 }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  await batch.commit();
  console.log('Batch 5 committed!');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
