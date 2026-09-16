import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  for (const name of ['trips', 'itinerary_days', 'activities', 'transports', 'accommodations', 'vouchers', 'expenses']) {
    try {
      const q = query(collection(db, name), limit(3));
      const s = await getDocs(q);
      console.log(`Collection [${name}]: count = ${s.size}`);
      s.forEach(d => console.log(`  - [${d.id}]:`, JSON.stringify(d.data()).slice(0, 100)));
    } catch (e: any) {
      console.log(`Collection [${name}] error:`, e.message);
    }
  }
}
test().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
