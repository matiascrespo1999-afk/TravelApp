import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const expensesSnap = await getDocs(collection(db, 'trips/europa-2026/expenses'));
  const expenses = expensesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Sort by date or id
  expenses.sort((a: any, b: any) => (a.expenseDate || '').localeCompare(b.expenseDate || '') || a.id.localeCompare(b.id));

  console.log(`TOTAL REGISTROS: ${expenses.length}\n`);
  let sumUSD = 0;
  let sumMatias = 0;
  let sumAriel = 0;

  expenses.forEach((e: any, idx: number) => {
    const splitMati = e.splits?.find((s: any) => s.userId === 'USR_01')?.assignedUsdAmount || 0;
    const splitAri = e.splits?.find((s: any) => s.userId === 'USR_02')?.assignedUsdAmount || 0;
    const totalExpUSD = e.calculatedUsdAmount || e.realUsdAmount || (splitMati + splitAri);
    const payerName = e.paidByUserId === 'USR_01' ? 'Matías' : e.paidByUserId === 'USR_02' ? 'Ariel' : (e.payer || 'Otro');
    sumUSD += totalExpUSD;
    sumMatias += splitMati;
    sumAriel += splitAri;

    console.log(`${idx + 1}. [${e.expenseDate || 'Pre-viaje'}] ${e.title} - ${e.originalAmount} ${e.originalCurrency || 'USD'} (≈ $${totalExpUSD.toFixed(2)} USD) | Pagó: ${payerName} | Matías: $${splitMati.toFixed(2)} / Ariel: $${splitAri.toFixed(2)}`);
  });

  console.log(`\n----------------------------------------`);
  console.log(`TOTAL GENERAL: $${sumUSD.toFixed(2)} USD`);
  console.log(`TOTAL ASIGNADO MATÍAS: $${sumMatias.toFixed(2)} USD`);
  console.log(`TOTAL ASIGNADO ARIEL: $${sumAriel.toFixed(2)} USD`);
  process.exit(0);
}

run().catch(console.error);
