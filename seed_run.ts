import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const accommodations = JSON.parse(fs.readFileSync('./seed_data_1.json', 'utf8'));
  const batch = writeBatch(db);
  
  for (const acc of accommodations) {
    const ref = doc(db, 'trips/TRIP_CURRENT/accommodations', acc.ID_Alojamiento);
    batch.set(ref, {
      id: acc.ID_Alojamiento,
      cityCode: acc.Ciudad.toUpperCase().substring(0, 3) === 'LON' ? 'LONDRES' : acc.Ciudad.toUpperCase(),
      name: acc.Nombre,
      address: acc.Direccion,
      doorPin: acc.PIN_Puerta ? acc.PIN_Puerta.toString() : null,
      reservationCode: acc.Codigo_Reserva.toString(),
      checkInInstructions: acc.Indicaciones_Llegada,
      touristTaxEUR: acc.Indicaciones_Llegada.includes('Tasa turística') ? 30.80 : null,
      hasLuggageStorage: acc.Indicaciones_Llegada.includes('Consigna'),
      mapsUrl: acc.Link_Maps,
      supermarketsUrl: acc.Link_Supermercados,
      updatedAt: Date.now()
    });
  }
  
  // Set members to 4 digits PIN
  batch.update(doc(db, 'trips/TRIP_CURRENT/members/NOjy31HJKoPFes9nHmPW3QxJpUI2'), { pin: '1234' });
  batch.update(doc(db, 'trips/TRIP_CURRENT/members/n6S5Y98th9WyYzBfAjKrl83Lsui2'), { pin: '1234' });
  
  // Set trip dates correctly
  batch.update(doc(db, 'trips/TRIP_CURRENT'), {
    startDate: '2026-09-29',
    endDate: '2026-10-15',
    baseCurrency: 'USD',
    rates: { EUR_USD: 1.10, GBP_USD: 1.32 }
  });

  await batch.commit();
  console.log('Batch 1 committed!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
