import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

async function run() {
  const batch = writeBatch(db);
  const itinerary = [
    { day: 1, date: '2026-09-29', dateLabel: 'Mar 29 Septiembre', cityCode: 'TRANSITO', city: 'Buenos Aires / Tránsito', title: 'Vuelo transatlántico nocturno directo Plus Ultra PU502 hacia Madrid.', alerts: 'Cuidar pertenencias, no cambiar divisas en aeropuerto. | ✈️ Estar en Ezeiza a las 10:00 h (3.5 hs antes). Despacho en Terminal A.', clothes: 'Ropa cómoda para vuelo, abrigo ligero.' },
    { day: 2, date: '2026-09-30', dateLabel: 'Mié 30 Septiembre', cityCode: 'ROMA', city: 'Madrid / Roma', title: 'Conexión en Barajas, llegada a Roma FCO (13:55 h con Iberia IB649), tren Leonardo Express a Termini, check-in en Sallustiano...', alerts: 'Ignorar falsos taxistas, cuidar celulares en mirador del Pincio. | 🚆 En Roma FCO tomar tren Leonardo Express directo a Termini (14 € en molinete).', clothes: 'Ropa cómoda, calzado para caminar.' },
    { day: 3, date: '2026-10-01', dateLabel: 'Jue 01 Octubre', cityCode: 'ROMA', city: 'Roma', title: '08:30 h Ingreso a Sitios SUPER (Casa de Augusto con frescos intactos, Santa Maria Antiqua, Curia Julia...', alerts: '🎟️ Pasaportes físicos OBLIGATORIOS para ingresar a Sitios SUPER (08:30 h en Via di San Gregorio) y Coliseo (11:45 h en acceso Sperone Valadier).', clothes: 'Ropa ligera, gorra, calzado cómodo.' },
    { day: 4, date: '2026-10-02', dateLabel: 'Vie 02 Octubre', cityCode: 'ROMA', city: 'Roma', title: '08:45 h Museos Vaticanos y Capilla Sixtina, Basílica de San Pedro con La Piedad, almuerzo en Borgo Pio, Castel Sant\'Angelo...', alerts: 'Falsos asistentes, carteristas en puente Sant\'Angelo. | ⛪ Requisito Vaticano: hombros y rodillas 100% cubiertos.', clothes: 'Ropa que cubra hombros y rodillas.' },
    { day: 5, date: '2026-10-03', dateLabel: 'Sáb 03 Octubre', cityCode: 'LONDRES', city: 'Roma / Londres', title: 'Check-out en Sallustiano, tren a FCO, 12:10 h vuelo Wizz Air, tren Thameslink, check-in en Vrbo London Borough, paseo crepuscular por South Bank...', alerts: 'Revendedores de entradas en South Bank. | 🚇 En Londres no compren tarjeta Oyster; usen tarjeta Contactless directa en molinetes.', clothes: 'Ropa abrigada, paraguas/piloto.' },
    { day: 6, date: '2026-10-04', dateLabel: 'Dom 04 Octubre', cityCode: 'LONDRES', city: 'Londres', title: 'Westminster Abbey, Big Ben, St. James\'s Park, Cambio de Guardia, almuerzo en Borough Market, cruce por Millennium Bridge, St. Paul\'s Cathedral...', alerts: 'Juego clandestino de la bolita en puentes, cuidar mochilas. | 💂 Estar 10:35 h en Victoria Memorial para el Cambio de Guardia.', clothes: 'Ropa en capas, abrigo ligero.' },
    { day: 7, date: '2026-10-05', dateLabel: 'Lun 05 Octubre', cityCode: 'OXFORD', city: 'Londres / Oxford', title: '09:30 h British Museum, almuerzo en Russell Square, tren rápido GWR a Oxford, Walking Tour & Recorridos Internos Harry Potter...', alerts: 'Cuidar compras en andenes de tren. | 🏛️ British Museum 09:30 h con reserva #10768272. Descargar audioguía previa.', clothes: 'Calzado cómodo de marcha.' },
    { day: 8, date: '2026-10-06', dateLabel: 'Mar 06 Octubre', cityCode: 'LONDRES', city: 'Londres', title: 'Notting Hill, Natural History Museum, Garden Lodge (Freddie Mercury), Sky Garden al atardecer, Leadenhall Market y Free Tour Jack el Destripador...', alerts: 'Mochilas al frente en callejones de Whitechapel durante el tour nocturno. | 🚇 A las 18:45 h tomar la línea District Line directa en South Kensington hasta Tower Hill.', clothes: 'Ropa casual en capas.' },
    { day: 9, date: '2026-10-07', dateLabel: 'Mié 07 Octubre', cityCode: 'LONDRES', city: 'Londres', title: 'Camden Town, 11:45 h tren a Watford, Warner Bros. Studio Tour London (Harry Potter), foto oficial en Andén 9 ¾ y cena de despedida...', alerts: 'No comprar souvenirs en el puente, tomar solo el bus oficial en Watford. | ⚡ Tren de London Euston a Watford Junction a las 11:45 h.', clothes: 'Ropa cómoda.' },
    { day: 10, date: '2026-10-08', dateLabel: 'Jue 08 Octubre', cityCode: 'BCN', city: 'Londres / Barcelona', title: 'Desayuno en Southwark, Thameslink + DART a Luton, vuelo Wizz Air UK a Barcelona, Aerobús A2, check-in en Medea Hostal, Passeig de Gràcia...', alerts: 'Ignorar maleteros falsos en El Prat, carteristas en Passeig de Gràcia. | 🏨 En Medea Hostal abonar 30.80 € de tasa turística.', clothes: 'Ropa ligera.' },
    { day: 11, date: '2026-10-09', dateLabel: 'Vie 09 Octubre', cityCode: 'BCN', city: 'Barcelona', title: '09:15 h Park Güell, almuerzo de tapas en Gràcia, 13:15 h Sagrada Família (subida a la torre 14:45 h), walking tour por Barrio Gótico y El Born...', alerts: 'Vendedores ambulantes, carteristas en calles estrechas del Gótico. | ⛪ Sagrada Família 13:15 h.', clothes: 'Ropa cómoda, calzado deportivo.' },
    { day: 12, date: '2026-10-10', dateLabel: 'Sáb 10 Octubre', cityCode: 'MADRID', city: 'Barcelona / Girona / Madrid', title: 'Salida hacia Sants, Renfe Avant a Girona, Walking Tour Game of Thrones, regreso a Sants, tarde chill en Montjuïc, tren Ouigo a Madrid...', alerts: 'Cuidar pertenencias en consignas de Sants. | 🚆 Estar en Barcelona Sants a las 19:30 h para control de escáner.', clothes: 'Ropa ligera, abrigo para tren.' },
    { day: 13, date: '2026-10-11', dateLabel: 'Dom 11 Octubre', cityCode: 'MADRID', city: 'Madrid', title: 'Desayuno en San Ginés, Palacio Real, Prado (Las Meninas), Parque de El Retiro y atardecer en Templo de Debod...', alerts: 'Personas disfrazadas pidiendo dinero en Plaza Mayor, carteristas en Sol. | 👑 Palacio Real 10:45 h y Prado 14:30 h.', clothes: 'Ropa elegante/casual.' },
    { day: 14, date: '2026-10-12', dateLabel: 'Lun 12 Octubre', cityCode: 'MADRID', city: 'Madrid', title: '09:00 h Desfile de la Fiesta Nacional en la Castellana, Plaza de Cibeles, Puerta de Alcalá, Reina Sofía (Guernica), compras en Chueca y Malasaña...', alerts: 'Grandes multitudes por el desfile militar; extremar cuidado de celulares. | 🇪🇸 Museos Reina Sofía y Thyssen 100% gratuitos.', clothes: 'Ropa casual cómoda.' },
    { day: 15, date: '2026-10-13', dateLabel: 'Mar 13 Octubre', cityCode: 'TOLEDO', city: 'Toledo / Madrid', title: 'Tren Avant a Toledo, excursión con Eva: Senda Ecológica del Tajo, Mirador del Valle, Judería, San Juan de los Reyes, Catedral Primada...', alerts: 'Pendientes pronunciadas y adoquines antiguos en Toledo; caminar con calma. | 👟 Calzado con agarre para adoquines.', clothes: 'Ropa cómoda de marcha.' },
    { day: 16, date: '2026-10-14', dateLabel: 'Mié 14 Octubre', cityCode: 'TRANSITO', city: 'Madrid / Tránsito', title: 'Jornada Super Chill: check-out en IC19, Campo del Moro, almuerzo en Plaza de Santa Ana, escaneo DIVA Tax Free en Barajas T4 y vuelo nocturno Plus Ultra...', alerts: 'Escanear DIVA antes de despachar valijas. | ✈️ 19:15 h en Barajas T4: Escanear códigos DIVA en quioscos.', clothes: 'Ropa cómoda para vuelo nocturno.' },
    { day: 17, date: '2026-10-15', dateLabel: 'Jue 15 Octubre', cityCode: 'TRANSITO', city: 'Buenos Aires', title: '06:45 h Aterrizaje en el Aeropuerto de Ezeiza (EZE), control de aduana y migraciones argentinas, regreso a casa...', alerts: 'Tomar transporte oficial en los mostradores autorizados del aeropuerto. | 🇦🇷 Aterrizaje en Ezeiza a las 06:45 h.', clothes: 'Ropa cómoda.' }
  ];

  for (const d of itinerary) {
    batch.set(doc(db, 'trips/TRIP_CURRENT/itinerary_days', 'DIA_' + d.day.toString().padStart(2, '0')), {
      id: 'DIA_' + d.day.toString().padStart(2, '0'),
      dayIndex: d.day,
      date: d.date,
      dateLabel: d.dateLabel,
      cityCode: d.cityCode,
      city: d.city,
      title: d.title,
      alerts: d.alerts,
      clothes: d.clothes,
      updatedAt: Date.now()
    });
  }

  await batch.commit();
  console.log('Batch 6 committed!');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
