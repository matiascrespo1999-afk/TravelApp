import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const batch = writeBatch(db);
  const transports = [
    { id: 'TR_01', type: 'FLIGHT', comp: 'Plus Ultra', num: 'PU502', from: 'EZE (Ezeiza T-A)', to: 'MAD (Barajas T4S)', start: '2026-09-29T16:25:00.000Z', end: '2026-09-30T09:45:00.000Z', note: '+1 día (30/09)', pnr: 'CRPGEF', bag: '1 valija 23 kg bodega + 10 kg cabina', url: 'https://checkin.plusultra.com/' },
    { id: 'TR_02', type: 'FLIGHT', comp: 'Iberia', num: 'IB649', from: 'MAD (Barajas T4)', to: 'FCO (Fiumicino T3)', start: '2026-09-30T14:30:00.000Z', end: '2026-09-30T16:55:00.000Z', note: 'Mismo día (30/09)', pnr: 'L1HVG', bag: 'Equipaje de mano incluido', url: 'https://www.iberia.com/es/autocheckin-online/' },
    { id: 'TR_03', type: 'FLIGHT', comp: 'Wizz Air Malta', num: 'W46005', from: 'FCO (Fiumicino T3)', to: 'LTN (Luton)', start: '2026-10-03T15:10:00.000Z', end: '2026-10-03T17:00:00.000Z', note: 'Mismo día (03/10)', pnr: 'AGKITL / YGR6QB', bag: 'Equipaje de cabina incluido', url: 'https://wizzair.com/es-es/viajes/facturacion-y-reservas' },
    { id: 'TR_03B', type: 'TRAIN', comp: 'Thameslink', num: '', from: 'Luton Airport Parkway', to: 'London Bridge', start: '2026-10-03T17:45:00.000Z', end: '2026-10-03T18:40:00.000Z', note: '55 min directo', pnr: '', bag: 'Equipaje estándar National Rail', url: 'https://www.thameslinkrailway.com/' },
    { id: 'TR_04A', type: 'TRAIN', comp: 'GWR', num: '', from: 'London Paddington', to: 'Oxford', start: '2026-10-05T17:23:00.000Z', end: '2026-10-05T18:16:00.000Z', note: 'Coche H Asientos 23 y 24', pnr: 'AAB5JPMDYLW / AAB5JPMDYLY', bag: 'Advance Single · Coach H', url: 'https://www.gwr.com/' },
    { id: 'TR_04B', type: 'TRAIN', comp: 'Chiltern Railways', num: '', from: 'Oxford', to: 'London Marylebone', start: '2026-10-05T21:49:00.000Z', end: '2026-10-05T23:14:00.000Z', note: 'Asiento libre Standard', pnr: 'AAB5JPMDYL2 / AAB5JPMDYL4', bag: 'Advance Single · Unreserved', url: 'https://www.chilternrailways.co.uk/' },
    { id: 'TR_05', type: 'TRAIN', comp: 'Thameslink + Luton DART', num: '', from: 'London Bridge', to: 'Luton Airport (LUA)', start: '2026-10-08T12:06:00.000Z', end: '2026-10-08T13:05:00.000Z', note: 'Conexión DART incluida', pnr: 'Omio 4511309', bag: 'Equipaje estándar hacia aeropuerto', url: 'https://www.omio.com/' },
    { id: 'TR_06', type: 'FLIGHT', comp: 'Wizz Air UK', num: 'W95359', from: 'LTN (Luton)', to: 'BCN (El Prat T2)', start: '2026-10-08T15:45:00.000Z', end: '2026-10-08T18:55:00.000Z', note: 'Mismo día (08/10)', pnr: 'OHNC8Y', bag: 'Equipaje de cabina incluido', url: 'https://wizzair.com/es-es/viajes/facturacion-y-reservas' },
    { id: 'TR_07A', type: 'TRAIN', comp: 'Renfe Avant', num: '', from: 'Barcelona Sants', to: 'Girona', start: '2026-10-10T11:05:00.000Z', end: '2026-10-10T11:45:00.000Z', note: '38 min alta velocidad', pnr: 'Omio R4DZPN', bag: 'Equipaje de mano estándar Renfe', url: 'https://www.renfe.com/' },
    { id: 'TR_07B', type: 'TRAIN', comp: 'Renfe Avant', num: '', from: 'Girona', to: 'Barcelona Sants', start: '2026-10-10T18:11:00.000Z', end: '2026-10-10T18:50:00.000Z', note: '39 min alta velocidad', pnr: 'Omio R4DZPN', bag: 'Equipaje de mano estándar Renfe', url: 'https://www.renfe.com/' },
    { id: 'TR_08', type: 'TRAIN', comp: 'Ouigo Spain', num: '6610', from: 'Barcelona Sants', to: 'Madrid Puerta de Atocha', start: '2026-10-10T23:20:00.000Z', end: '2026-10-11T02:48:00.000Z', note: 'Control escáner 19:30 h en Sants', pnr: '3ULYP5', bag: 'Equipaje de cabina + 1 bolso de mano', url: 'https://www.ouigo.com/es/mis-billetes' },
    { id: 'TR_09A', type: 'TRAIN', comp: 'Renfe Avant', num: '', from: 'Madrid Atocha', to: 'Toledo', start: '2026-10-13T11:50:00.000Z', end: '2026-10-13T12:23:00.000Z', note: '33 min directo', pnr: '', bag: 'Mochila de marcha diaria', url: 'https://www.renfe.com/' },
    { id: 'TR_09B', type: 'TRAIN', comp: 'Renfe Avant', num: '', from: 'Toledo', to: 'Madrid Atocha', start: '2026-10-13T20:25:00.000Z', end: '2026-10-13T20:58:00.000Z', note: '33 min directo', pnr: '', bag: 'Mochila de marcha diaria', url: 'https://www.renfe.com/' },
    { id: 'TR_10', type: 'FLIGHT', comp: 'Plus Ultra', num: 'PU501', from: 'MAD (Barajas T4)', to: 'EZE (Ezeiza T-A)', start: '2026-10-15T02:10:00.000Z', end: '2026-10-15T09:45:00.000Z', note: '+1 día (15/10)', pnr: 'CRPGEF', bag: '1 valija 23 kg bodega + carry-on', url: 'https://checkin.plusultra.com/' }
  ];

  for (const t of transports) {
    batch.set(doc(db, 'trips/TRIP_CURRENT/transports', t.id), {
      id: t.id,
      type: t.type,
      company: t.comp,
      flightNumber: t.num,
      route: t.from + ' ➔ ' + t.to,
      departureCity: t.from,
      arrivalCity: t.to,
      departureTime: t.start,
      arrivalTime: t.end,
      arrivalNote: t.note,
      checkinUrl: t.type === 'FLIGHT' ? t.url : null,
      tickets: [
        { travelerId: 'NOjy31HJKoPFes9nHmPW3QxJpUI2', name: 'Matías', pnr: t.pnr.split(' / ')[0] || t.pnr, baggage: t.bag },
        { travelerId: 'n6S5Y98th9WyYzBfAjKrl83Lsui2', name: 'Ariel', pnr: t.pnr.split(' / ')[1] || t.pnr, baggage: t.bag }
      ],
      updatedAt: Date.now()
    });
  }

  await batch.commit();
  console.log('Batch 3 committed!');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
