import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const expensesSnap = await getDocs(collection(db, 'trips/europa-2026/expenses'));
  const expenses = expensesSnap.docs.map(d => d.data());
  
  let totalMatias = 0;
  let totalAriel = 0;
  
  let paidMatias = 0;
  let paidAriel = 0;

  expenses.forEach(e => {
    e.splits?.forEach(s => {
      if (s.userId === 'USR_01') totalMatias += s.assignedUsdAmount || 0;
      if (s.userId === 'USR_02') totalAriel += s.assignedUsdAmount || 0;
    });
    
    if (e.paidByUserId === 'USR_01') paidMatias += e.calculatedUsdAmount || e.realUsdAmount || 0;
    if (e.paidByUserId === 'USR_02') paidAriel += e.calculatedUsdAmount || e.realUsdAmount || 0;
  });
  
  console.log(`GASTOS_TOTALES_MATIAS: ${totalMatias.toFixed(2)} USD`);
  console.log(`GASTOS_TOTALES_ARIEL: ${totalAriel.toFixed(2)} USD`);
  console.log(`PAGOS_MATIAS: ${paidMatias.toFixed(2)} USD`);
  console.log(`PAGOS_ARIEL: ${paidAriel.toFixed(2)} USD`);
  process.exit(0);
}

run().catch(console.error);
