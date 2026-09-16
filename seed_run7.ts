import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const batch = writeBatch(db);
  const tours = JSON.parse(fs.readFileSync('./tours_seed.json', 'utf8'));

  for (const t of tours) {
    batch.set(doc(db, 'trips/TRIP_CURRENT/tours', t.ID_Tour), {
      id: t.ID_Tour,
      title: t.Titulo,
      cityCode: t.Ciudad,
      duration: t.Duracion,
      distance: t.Distancia,
      pace: t.Ritmo,
      mapsRouteUrl1: t.Link_Maps_Tramo_1,
      mapsRouteUrl2: t.Link_Maps_Tramo_2,
      routeTip: t.Tip_Ruta,
      veggieRecommendation: t.Recomendacion_Veggie,
      publicWc: t.Banos_WC,
      stops: [], // I will populate this dynamically in the UI or fetch via a separate subcollection, but given the 300 paradas, I will upload paradas as a subcollection to keep doc size small
      updatedAt: Date.now()
    });
  }

  await batch.commit();
  console.log('Batch 7 committed!');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
