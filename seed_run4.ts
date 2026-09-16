import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const batch = writeBatch(db);
  const vouchers = [
    { id: 'VOUCH_01', type: 'Vuelo', title: 'Plus Ultra EZE ➔ MAD ➔ EZE', city: 'Buenos Aires / Madrid', time: '29/09 13:25 & 14/10 23:10', code: 'CRPGEF', desc: 'Vuelo transatlántico directo PU502 (Ida) y PU501 (Vuelta). Franquicia 23 kg en bodega. Matías & Ariel.', url: 'https://drive.google.com/file/d/1OR2q6-_2oOVZDvMpNbBldA45OsYBG97l/view', btn: 'Ver Vuelo Plus Ultra', maps: 'https://maps.google.com/?q=Aeropuerto+Ezeiza' },
    { id: 'VOUCH_02', type: 'Asistencia', title: 'Certificado Asistencia Médica Schengen', city: 'Europa (Schengen)', time: '29/09 al 15/10/2026', code: 'Poliza Visa', desc: 'Cobertura médica internacional que cumple requisitos del Tratado Schengen para Matías y Ariel.', url: 'https://drive.google.com/file/d/1Ac51TuY0FF_0wnbJJTVvlz4dTXZbRIHb/view', btn: 'Ver Certificado Schengen', maps: 'https://maps.google.com/?q=Aeropuerto+Ezeiza' },
    { id: 'VOUCH_03', type: 'Vuelo', title: 'Iberia MAD ➔ FCO', city: 'Madrid / Roma', time: '2026-09-30T14:30:00.000Z', code: 'L1HVG', desc: 'Vuelo directo IB649 a Roma Fiumicino T3. Matías & Ariel. Equipaje de mano incluido.', url: 'https://drive.google.com/file/d/1kL1-9dT3YNMz3qNIJRTijxNHqsDUvrkI/view', btn: 'Ver Vuelo Iberia', maps: 'https://maps.google.com/?q=Aeropuerto+Roma+Fiumicino' },
    { id: 'VOUCH_04', type: 'Entrada', title: 'Suplemento Sitios SUPER Foro Romano', city: 'Roma', time: '2026-10-01T11:30:00.000Z', code: 'OCO4751917', desc: 'Forum Pass SUPER. Acceso 08:30 h por Via di San Gregorio.', url: 'https://drive.google.com/file/d/1u_5U8GzoSP8KnFKkuOdP8NHv2_jpSnON/view', btn: 'Ver Pase Sitios SUPER', maps: 'https://maps.google.com/?q=Foro+Romano+Roma' },
    { id: 'VOUCH_05', type: 'Entrada', title: 'Coliseo Romano (Niveles 1 y 2)', city: 'Roma', time: '2026-10-01T15:00:00.000Z', code: 'OCO4690893', desc: 'Presentación 11:45 h en acceso Sperone Valadier. Matías & Ariel.', url: 'https://drive.google.com/file/d/1JKKHy5BGNxVwrjHCmhePBRy_G_XXqjHe/view', btn: 'Ver Entrada Coliseo', maps: 'https://maps.google.com/?q=Colosseo+Roma' },
    { id: 'VOUCH_06', type: 'Entrada', title: 'Museos Vaticanos & Capilla Sixtina', city: 'Roma', time: '2026-10-02T12:00:00.000Z', code: 'Turno Oficial 09:00', desc: 'Ingreso 08:45 h en Viale Vaticano. Capilla Sixtina y Estancias de Rafael. Matías & Ariel.', url: 'https://drive.google.com/file/d/1oyRV_9xvf5llj7RtUCQsIBXYQVOAwD9Y/view', btn: 'Ver Entrada Vaticano', maps: 'https://maps.google.com/?q=Musei+Vaticani+Roma' },
    { id: 'VOUCH_07', type: 'Entrada', title: 'Castel Sant\'Angelo', city: 'Roma', time: '2026-10-02T19:00:00.000Z', code: '6P225YMP', desc: 'Entrada individual completa. PNR 6P225YMP.', url: 'https://drive.google.com/file/d/1OOPvaLsD_vXUiKO1wn1tSWDbIkHcHYW0/view', btn: 'Ver Entrada Castel Sant\'Angelo', maps: 'https://maps.google.com/?q=Castel+Sant+Angelo+Roma' },
    { id: 'VOUCH_08', type: 'Vuelo', title: 'Wizz Air Malta FCO ➔ LTN', city: 'Roma / Londres', time: '2026-10-03T15:10:00.000Z', code: 'AGKITL / YGR6QB', desc: 'Vuelo W46005 a Londres Luton. Matías y Ariel.', url: 'https://drive.google.com/file/d/1NW4fxVeSGbWgO2JkM21tzqVYGPD77bVF/view', btn: 'Ver Reserva Wizz Air', maps: 'https://maps.google.com/?q=Luton+Airport' },
    { id: 'VOUCH_09', type: 'Recibo', title: 'Recibo de Pago Vuelo Wizz Air', city: 'Roma / Londres', time: '2026-10-03T15:10:00.000Z', code: 'Visa 470455', desc: 'Comprobante oficial de facturación y pago con tarjeta Visa.', url: 'https://drive.google.com/file/d/1tCJjulcvuJ1KALlTNdzNG25OhZLdN458/view', btn: 'Ver Recibo Wizz Air', maps: 'https://maps.google.com/?q=Luton+Airport' },
    { id: 'VOUCH_10', type: 'Entrada', title: 'British Museum (+ Audioguía Oficial)', city: 'Londres', time: '2026-10-05T12:30:00.000Z', code: '10768272', desc: 'Reserva oficial #10768272 + App de Audioguía Oficial.', url: 'https://drive.google.com/file/d/1QZ18lp29cRAWMYOlRaj5gxba73rNEFxp/view', btn: 'Ver Entrada British Museum', maps: 'https://maps.google.com/?q=British+Museum+London' },
    { id: 'VOUCH_11', type: 'Tren', title: 'GWR Tren Rápido Paddington ➔ Oxford', city: 'Londres / Oxford', time: '2026-10-05T17:23:00.000Z', code: 'KP655592', desc: 'Great Western Railway Tren W34894. Coche H, Asientos 23 y 24.', url: 'https://drive.google.com/file/d/1IPmlQqSCHtpKYUaRzyTuOPMJHy2in85D/view', btn: 'Ver Billete GWR Oxford Ida', maps: 'https://maps.google.com/?q=Paddington+Station+London' },
    { id: 'VOUCH_12', type: 'Tren', title: 'Chiltern Railways Oxford ➔ Marylebone', city: 'Oxford / Londres', time: '2026-10-05T21:49:00.000Z', code: 'PW374455', desc: 'Chiltern Railways Tren L37694. Asientos libres Standard.', url: 'https://drive.google.com/file/d/1EBruyWiFSLRVW5WwZLWIpnzG_MYn_AEe/view', btn: 'Ver Billete Chiltern Oxford Vuelta', maps: 'https://maps.google.com/?q=Oxford+Railway+Station' },
    { id: 'VOUCH_13', type: 'Entrada', title: 'Natural History Museum', city: 'Londres', time: '2026-10-06T15:00:00.000Z', code: '20260914-S17603541', desc: 'General Admission South Kensington. Turno 12:00 h.', url: 'https://maps.google.com/?q=Natural+History+Museum+London', btn: 'Ver Reserva NHM', maps: 'https://maps.google.com/?q=Natural+History+Museum+London' },
    { id: 'VOUCH_14', type: 'Entrada', title: 'Sky Garden (Atardecer en Walkie Talkie)', city: 'Londres', time: '2026-10-06T19:45:00.000Z', code: '20260914-72720652', desc: 'Reserva oficial #20260914-72720652. Turno 16:45 h.', url: 'https://drive.google.com/file/d/188NZN2QYyrA9bP3MDOVkp791WYerE8wI/view', btn: 'Ver Entrada Sky Garden', maps: 'https://maps.google.com/?q=Sky+Garden+London' },
    { id: 'VOUCH_15', type: 'Tour', title: 'Free Tour Jack el Destripador', city: 'Londres', time: '2026-10-06T22:30:00.000Z', code: '12768477', desc: 'Reserva GuruWalk #12768477. Encuentro 19:20 h frente a salida metro Tower Hill.', url: 'https://docs.google.com/document/d/1Tv_QdPnQa2nYhMyHkOw_b3xpxO8gPxJ-xrhLxPmDd80/edit', btn: 'Ver Voucher Jack el Destripador', maps: 'https://maps.google.com/?q=Tower+Hill+London' },
    { id: 'VOUCH_16', type: 'Entrada', title: 'Warner Bros. Studio Tour London', city: 'Londres / Watford', time: '2026-10-07T17:30:00.000Z', code: '7427241', desc: 'Reserva oficial #7427241. Turno 14:30 h en Leavesden.', url: 'https://drive.google.com/file/d/14D4uweqIbQ8ZHfRMem0jZ4-5UswRWRtw/view', btn: 'Ver Entrada Harry Potter', maps: 'https://maps.google.com/?q=Warner+Bros+Studio+Tour+London' },
    { id: 'VOUCH_17', type: 'Tren', title: 'Thameslink + Luton DART', city: 'Londres / Luton', time: '2026-10-08T12:06:00.000Z', code: 'Omio #4511309', desc: 'Tren Thameslink directo desde London Bridge a Luton Airport Parkway.', url: 'https://drive.google.com/file/d/1-soVltTivZlf7Th1JVnMG8jCvmp0-cRU/view', btn: 'Ver Billetes Thameslink', maps: 'https://maps.google.com/?q=London+Bridge+Station' },
    { id: 'VOUCH_18', type: 'Vuelo', title: 'Wizz Air UK LTN ➔ BCN T2', city: 'Londres / Barcelona', time: '2026-10-08T15:45:00.000Z', code: 'OHNC8Y', desc: 'Vuelo directo W95359 a Barcelona El Prat Terminal 2.', url: 'https://drive.google.com/file/d/1PlFNSbzCSdY8Xv0kzDze_4xxOeGibwCh/view', btn: 'Ver Vuelo Wizz Air BCN', maps: 'https://maps.google.com/?q=Aeropuerto+Barcelona+El+Prat' },
    { id: 'VOUCH_19', type: 'Entrada', title: 'Park Güell — Zona Monumental', city: 'Barcelona', time: '2026-10-09T12:15:00.000Z', code: 'Reserva Oficial Park Güell', desc: 'Acceso a zona monumental, banco ondulado de trencadís y Sala Hipóstila.', url: 'https://maps.google.com/?q=Park+Guell+Barcelona', btn: 'Ver Entrada Park Güell', maps: 'https://maps.google.com/?q=Park+Guell+Barcelona' },
    { id: 'VOUCH_20', type: 'Entrada', title: 'Basílica de la Sagrada Família', city: 'Barcelona', time: '2026-10-09T16:15:00.000Z', code: '105237741', desc: 'Entrada general basílica 13:15 h + Acceso a la Torre 14:45 h.', url: 'https://maps.google.com/?q=Sagrada+Familia+Barcelona', btn: 'Ver Entrada Sagrada Família', maps: 'https://maps.google.com/?q=Sagrada+Familia+Barcelona' },
    { id: 'VOUCH_21', type: 'Tren', title: 'Renfe Avant Barcelona ➔ Girona', city: 'Barcelona / Girona', time: '2026-10-10T11:05:00.000Z', code: 'Omio #R4DZPN', desc: 'Tren Avant de alta velocidad (38 min). Salida 08:05 h ➔ Llegada 08:45 h.', url: 'https://drive.google.com/file/d/1fZ7qIKbY_HDv1dgTvwVqV1FI32PORbgF/view', btn: 'Ver Billete Girona Ida', maps: 'https://maps.google.com/?q=Barcelona+Sants' },
    { id: 'VOUCH_22', type: 'Tren', title: 'Renfe Avant Girona ➔ Barcelona', city: 'Girona / Barcelona', time: '2026-10-10T18:11:00.000Z', code: 'Omio #R4DZPN', desc: 'Tren Avant de alta velocidad (39 min). Salida 15:11 h ➔ Llegada 15:50 h.', url: 'https://drive.google.com/file/d/1fZ7qIKbY_HDv1dgTvwVqV1FI32PORbgF/view', btn: 'Ver Billete Girona Vuelta', maps: 'https://maps.google.com/?q=Girona+Railway+Station' },
    { id: 'VOUCH_23', type: 'Tren', title: 'Ouigo Spain 06610 Barcelona ➔ Madrid', city: 'Barcelona / Madrid', time: '2026-10-10T23:20:00.000Z', code: '3ULYP5', desc: 'Tren de alta velocidad doble piso Ouigo. Salida 20:20 h.', url: 'https://drive.google.com/file/d/1MJGxY75L4YcB1TA3zC0aNIAQ9hItAUiT/view', btn: 'Ver Billete Ouigo Madrid', maps: 'https://maps.google.com/?q=Estacion+Madrid+Puerta+de+Atocha' },
    { id: 'VOUCH_24', type: 'Entrada', title: 'Palacio Real de Madrid', city: 'Madrid', time: '2026-10-11T13:45:00.000Z', code: 'FEHA59CNK / 5KK7TKF8W5V239J39YXX', desc: 'Entrada oficial 10:45 h con audioguía oficial en app.', url: 'https://drive.google.com/file/d/1Pf4gX9mAzqrc0WPAYAKuPCEoJ53U_1SB/view', btn: 'Ver Entrada Palacio Real', maps: 'https://maps.google.com/?q=Palacio+Real+de+Madrid' },
    { id: 'VOUCH_25', type: 'Entrada', title: 'Museo Nacional del Prado', city: 'Madrid', time: '2026-10-11T17:30:00.000Z', code: 'M394648F', desc: 'Entrada oficial 14:30 h con audioguía oficial. Localizador M394648F.', url: 'https://drive.google.com/file/d/1J1aXiDuY6FpsbQmdc8DHOG5Z7K433bwp/view', btn: 'Ver Entrada Museo del Prado', maps: 'https://maps.google.com/?q=Museo+del+Prado+Madrid' },
    { id: 'VOUCH_26', type: 'Pase VIP', title: 'Fast Pass Ezeiza — Visa', city: 'Buenos Aires', time: '2026-09-29T13:00:00.000Z', code: 'ECT2098407029155561474', desc: 'Pase de acceso prioritario para control de seguridad y migraciones en Ezeiza.', url: 'https://drive.google.com/file/d/1JFjrfPkEiTx_67rcserqvxIl8HspffSC/view', btn: 'Ver Fast Pass Ezeiza', maps: 'https://maps.google.com/?q=Aeropuerto+Internacional+Ezeiza' }
  ];

  for (const v of vouchers) {
    batch.set(doc(db, 'trips/TRIP_CURRENT/vouchers', v.id), {
      id: v.id,
      title: v.title,
      type: v.type,
      city: v.city,
      datetime: v.time,
      code: v.code,
      description: v.desc,
      driveUrl: v.url,
      buttonText: v.btn,
      mapsUrl: v.maps,
      updatedAt: Date.now()
    });
  }

  await batch.commit();
  console.log('Batch 4 committed!');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
