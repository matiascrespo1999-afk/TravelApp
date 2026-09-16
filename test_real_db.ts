import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const tripDoc = await getDoc(doc(db, 'trips', 'TRIP_CURRENT'));
  console.log('Trip doc exists:', tripDoc.exists(), tripDoc.data() ? Object.keys(tripDoc.data()!) : null);
  
  const subcols = [
    'members',
    'destinations',
    'accommodations',
    'transports',
    'activities',
    'tours',
    'tour_stops',
    'monument_steps',
    'vouchers',
    'expenses',
    'itinerary_days'
  ];

  for (const s of subcols) {
    const snap = await getDocs(collection(db, `trips/TRIP_CURRENT/${s}`));
    console.log(`Subcollection [${s}]: ${snap.size} docs`);
  }
}
run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
