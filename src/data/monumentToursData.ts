import { WalkingTour } from '../types';

export const INITIAL_INTERNAL_MONUMENT_TOURS: Record<string, WalkingTour> = {
  'prado-madrid': {
    id: 'prado-madrid',
    title: 'Museo Nacional del Prado: Obras Maestras Imprescindibles',
    cityCode: 'MADRID',
    duration: '2h 15m',
    distance: '1.2 km (interior)',
    pace: 'Contemplativo',
    fullMapsUrl: 'https://maps.google.com/?q=Museo+del+Prado+Madrid',
    tip: 'Entrada por Puerta de los Jerónimos. Se prohíbe tomar fotografías en las salas de exposición.',
    rec: 'Empieza temprano en la Sala 12 para ver Las Meninas sin aglomeraciones.',
    wc: 'Planta 0 (junto a Puerta de Murillo) y en cafetería del Claustro de los Jerónimos.',
    tourType: 'monument',
    attractionName: 'Museo del Prado',
    dressCode: 'Mochilas medianas/grandes deben dejarse en guardarropa gratuito.',
    stops: [
      {
        num: 1,
        name: 'Las Meninas (Diego Velázquez)',
        roomOrHall: 'Sala 012 (Planta 1)',
        direction: 'Desde la rotonda central de la Planta 1, avanza por la Gran Galería hacia el ala central.',
        mustSeeArtwork: 'El reflejo del Rey Felipe IV y Mariana de Austria en el espejo del fondo, y la Cruz de Santiago en el pecho de Velázquez pintada posteriormente.',
        description: 'La cumbre del barroco español. Velázquez rompe la cuarta pared pintándote a ti (el espectador en la posición de los reyes) mientras retrata a la infanta Margarita rodeada de sus damas.',
        trivia: 'Pop Culture / Secreto: La cruz roja de la Orden de Santiago en el pecho del pintor fue añadida por orden real tras la muerte de Velázquez, reconociendo su nobleza.',
        photoAllowed: false,
        photoAngle: 'No permitido fotografiar dentro del museo. Admira la perspectiva aérea situándote a 4 metros en diagonal.'
      },
      {
        num: 2,
        name: 'El Jardín de las Delicias (El Bosco)',
        roomOrHall: 'Sala 056A (Planta 0)',
        direction: 'Baja las escaleras centrales hacia la Planta 0, sector de pintura flamenca.',
        mustSeeArtwork: 'El panel derecho ("El Infierno Musical"): busca la partitura demoníaca tatuada en los glúteos de un condenado.',
        description: 'Tríptico enigmático que representa la Creación, el falso paraíso de los placeres mundanos y el tormento infernal. Fue una de las obras favoritas del rey Felipe II en El Escorial.',
        trivia: 'Música real: Un estudiante transcribió las notas musicales pintadas en el trasero del pecador en el infierno y las convirtió en una melodía sacra real.',
        photoAllowed: false,
        photoAngle: 'Observa de cerca los diminutos seres híbridos de cristal y las fresas gigantes.'
      },
      {
        num: 3,
        name: 'El 3 de Mayo en Madrid / Los Fusilamientos (Goya)',
        roomOrHall: 'Sala 067 (Planta 1)',
        direction: 'Regresa a Planta 1, ala sur, salas dedicadas a Francisco de Goya.',
        mustSeeArtwork: 'El hombre de camisa blanca con los brazos en cruz evocando la crucifixión, iluminado por el farol en el suelo.',
        description: 'Homenaje desgarrador a la resistencia española contra las tropas napoleónicas en 1808. La iluminación dramática inspiró a Picasso para pintar el Guernica.',
        trivia: 'Dato histórico: Goya pintó esta obra en 1814 para pedir una pensión al rey Fernando VII al término de la Guerra de la Independencia.',
        photoAllowed: false,
        photoAngle: 'Fíjate en el pelotón de fusilamiento: no tienen rostro individual, son una máquina de guerra anónima.'
      },
      {
        num: 4,
        name: 'Saturno devorando a su hijo (Pinturas Negras de Goya)',
        roomOrHall: 'Sala 067 (Planta 1)',
        direction: 'Dentro del mismo sector de Goya, en la sala dedicada a las Pinturas Negras de la Quinta del Sordo.',
        mustSeeArtwork: 'La mirada desorbitada y enloquecida del titán Saturno mientras devora el cuerpo ensangrentado de su vástago.',
        description: 'Pintadas originalmente al óleo sobre las paredes de la casa de campo de Goya. Refleja la angustia del pintor anciano, sordo y desilusionado con la política española.',
        trivia: 'Curiosidad: Goya nunca tituló estas obras ni pensó exhibirlas públicamente; eran para su propia contemplación privada.',
        photoAllowed: false
      },
      {
        num: 5,
        name: 'Carlos V a caballo en Mühlberg (Tiziano)',
        roomOrHall: 'Sala 027 (Planta 1)',
        direction: 'Gran Galería central, junto a las salas de pintura veneciana.',
        mustSeeArtwork: 'El brillo metálico hiperrealista de la armadura del emperador (la armadura real se conserva en la Real Armería de Madrid).',
        description: 'El retrato ecuestre definitivo del Renacimiento. Conmemora la victoria imperial en la batalla de Mühlberg (1547).',
        trivia: 'Historia: El cuadro cayó de su caballete durante una tormenta y se rasgó antes de ser entregado al emperador; Tiziano lo restauró personalmente.',
        photoAllowed: false
      },
      {
        num: 6,
        name: 'Las Tres Gracias (Peter Paul Rubens)',
        roomOrHall: 'Sala 029 (Planta 1)',
        direction: 'Salas de pintura flamenca del siglo XVII.',
        mustSeeArtwork: 'El entrelazado de los brazos de las tres hijas de Zeus (Áglae, Eufrósine y Talía) bajo una guirnalda de flores.',
        description: 'Símbolo del canon de belleza barroco, la sensualidad y la alegría de vivir. Rubens la pintó para su propia colección personal.',
        trivia: 'Curiosidad: La modelo de la gracia de la izquierda es Hélène Fourment, la joven segunda esposa de Rubens con quien se casó a los 53 años.',
        photoAllowed: false
      }
    ]
  },
  'vaticano-roma': {
    id: 'vaticano-roma',
    title: 'Museos Vaticanos & Capilla Sixtina: Ruta de las Obras Maestras',
    cityCode: 'ROMA',
    duration: '2h 45m',
    distance: '1.8 km (interior)',
    pace: 'Moderado',
    fullMapsUrl: 'https://maps.google.com/?q=Museos+Vaticanos+Roma',
    tip: 'Imprescindible hombros y rodillas cubiertos para acceder a la Capilla Sixtina.',
    rec: 'Reserva oficial con audioguía. Sigue el cartel "Percorso Corto" si hay demasiada multitud.',
    wc: 'Patio de la Piña (entrada), junto a Estancias de Rafael y salida de la Capilla Sixtina.',
    tourType: 'monument',
    attractionName: 'Museos Vaticanos',
    dressCode: 'Pantalón por debajo de la rodilla y hombros cubiertos (código vaticano estricto).',
    stops: [
      {
        num: 1,
        name: 'Patio de la Piña (Cortile della Pigna)',
        roomOrHall: 'Exterior / Patio Principal',
        direction: 'Tras pasar los controles de seguridad y recoger la audioguía, sal al patio abierto.',
        mustSeeArtwork: 'La gigantesca piña de bronce del siglo I d.C. (antigua fuente romana) y la escultura moderna "Sfera con Sfera" de Arnaldo Pomodoro.',
        description: 'Punto de orientación inicial. Vista privilegiada de la cúpula de San Pedro y paneles explicativos de la Capilla Sixtina.',
        trivia: 'Historia: La piña de bronce originalmente estaba en el Campo de Marte de la Roma imperial y fue mencionada por Dante en la Divina Comedia.',
        photoAllowed: true,
        photoAngle: 'Foto con la esfera dorada giratoria reflejando la arquitectura renacentista.'
      },
      {
        num: 2,
        name: 'El Laocoonte y sus hijos (Museo Pío-Clementino)',
        roomOrHall: 'Patio Octogonal',
        direction: 'Entra al Museo Pío-Clementino hacia el patio octogonal al aire libre.',
        mustSeeArtwork: 'La expresión de sufrimiento extremo del sacerdote troyano mientras lucha contra las serpientes marinas enviadas por los dioses.',
        description: 'Escultura griega helenística desenterrada en Roma en 1506 en presencia del mismísimo Miguel Ángel, quien quedó profundamente marcado por su musculatura.',
        trivia: 'Dato legendario: El brazo derecho de Laocoonte faltaba cuando se encontró. Miguel Ángel acertó que estaba doblado hacia atrás, aunque otros lo reconstruyeron extendido hasta 1957 cuando se halló la pieza original.',
        photoAllowed: true
      },
      {
        num: 3,
        name: 'Galería de los Mapas (Galleria delle Carte Geografiche)',
        roomOrHall: 'Galería de 120 metros',
        direction: 'Avanza por el pasillo hacia las galerías superiores camino a la Capilla Sixtina.',
        mustSeeArtwork: 'El espectacular techo dorado con frescos de milagros santos y los 40 mapas topográficos de las regiones de Italia pintados en 1580.',
        description: 'Una de las perspectivas visuales más impactantes del Vaticano. Los mapas son tan precisos que muestran calzadas romanas y puertos con precisión del 80%.',
        trivia: 'Dato curioso: Italia se muestra al revés según la orientación habitual renacentista en algunas secciones para reflejar la visión de Roma hacia el mar.',
        photoAllowed: true,
        photoAngle: 'Apunta tu cámara en gran angular hacia el techo dorado desde el centro de la galería.'
      },
      {
        num: 4,
        name: 'La Escuela de Atenas (Estancias de Rafael)',
        roomOrHall: 'Stanza della Segnatura',
        direction: 'Entra a los aposentos privados del Papa Julio II pintados por Rafael Sanzio.',
        mustSeeArtwork: 'Platón señalando al cielo (con el rostro de Leonardo da Vinci) y Aristóteles señalando a la tierra, junto a Heráclito meditando en primer plano (con el rostro de Miguel Ángel).',
        description: 'La máxima síntesis del pensamiento clásico renacentista: armonía entre fe, filosofía, matemáticas y ciencia.',
        trivia: 'Secreto de Rafael: Busca al extremo derecho al joven de boina negra que te mira directamente: es el propio autorretrato de Rafael con 26 años.',
        photoAllowed: true,
        photoAngle: 'Párate frente al fresco a 3 metros para captar el arco de triunfo ficticio en perspectiva.'
      },
      {
        num: 5,
        name: 'Capilla Sixtina: La Creación de Adán y Juicio Final (Miguel Ángel)',
        roomOrHall: 'Capilla Sixtina',
        direction: 'Baja las escaleras finales hasta el sanctasanctórum del cónclave papal.',
        mustSeeArtwork: 'El punto en la bóveda donde los dedos de Dios y Adán casi se tocan, y el autorretrato torturado de Miguel Ángel en la piel desollada de San Bartolomé en el Juicio Final.',
        description: 'La cumbre del arte universal. Miguel Ángel pasó 4 años acostado en andamios para pintar la bóveda (1508-1512) y regresó 25 años después para el Juicio Final.',
        trivia: 'Estricto: SILENCIO TOTAL. Prohibidas fotos y videos. Si tomas fotos, los guardias te pedirán borrarlas inmediatamente.',
        photoAllowed: false,
        photoAngle: 'Guarda el móvil. Mira hacia arriba y contempla los más de 300 personajes bíblicos.'
      },
      {
        num: 6,
        name: 'Escalera Helicoidal de Bramante',
        roomOrHall: 'Salida de los Museos',
        direction: 'Al salir de la tienda de recuerdos en dirección a la salida hacia Viale Vaticano.',
        mustSeeArtwork: 'La estructura de doble hélice diseñada por Giuseppe Momo en 1932: quienes bajan nunca se cruzan con quienes suben.',
        description: 'Una de las escaleras más fotografiadas del mundo con balaustrada de bronce labrado.',
        trivia: 'Diseño: Inspirada en la escalera renacentista original que Donato Bramante diseñó en 1505 para permitir subir caballos al palacio papal.',
        photoAllowed: true,
        photoAngle: 'Asómate al ojo central desde el piso superior y dispara verticalmente hacia el suelo espiral.'
      }
    ]
  },
  'sagrada-familia-bcn': {
    id: 'sagrada-familia-bcn',
    title: 'Basílica de la Sagrada Família: Arquitectura Mística de Gaudí',
    cityCode: 'BARCELONA',
    duration: '1h 45m',
    distance: '0.8 km (interior)',
    pace: 'Relajado',
    fullMapsUrl: 'https://maps.google.com/?q=Sagrada+Familia+Barcelona',
    tip: 'Descarga la app oficial de la Sagrada Família y ten tus auriculares listos.',
    rec: 'La mejor luz solar entra por los vitrales rojos de poniente a partir de las 16:30 h.',
    wc: 'Baños en la nave subterránea junto al acceso del Museo Gaudí y tienda oficial.',
    tourType: 'monument',
    attractionName: 'Sagrada Família',
    dressCode: 'Vestimenta respetuosa (sin transparencias, espaldas descubiertas ni pantalones muy cortos).',
    stops: [
      {
        num: 1,
        name: 'Fachada del Nacimiento',
        roomOrHall: 'Exterior / Carrer de la Marina',
        direction: 'Punto de entrada general con los tickets y audioguía activa.',
        mustSeeArtwork: 'El árbol de la vida (ciprés verde de cerámica con palomas blancas) y las tortugas de piedra que sostienen las columnas de la entrada.',
        description: 'La única fachada construida casi en su totalidad en vida de Antoni Gaudí. Llena de vida natural, flora, fauna de Cataluña y figuras bíblicas esculpidas.',
        trivia: 'Dato de Gaudí: Usó vaciados en yeso de rostros de obreros locales y niños enfermos del hospital para modelar las figuras con realismo absoluto.',
        photoAllowed: true,
        photoAngle: 'Desde el parque de la Plaza de Gaudí con el estanque reflejando las torres.'
      },
      {
        num: 2,
        name: 'El Bosque de Columnas y Vitrales de la Nave',
        roomOrHall: 'Nave Central Interior',
        direction: 'Cruza el portal de bronce con inscripciones en relieve hacia el interior del templo.',
        mustSeeArtwork: 'Las columnas de pórfido y basalto que se ramifican como árboles hacia la bóveda de 45 metros de altura.',
        description: 'Gaudí concibió el interior como un bosque sagrado. Los vitrales del este (salida del sol) son de tonos azules y verdes (misterio y nacimiento), y los del oeste de tonos naranjas y rojos (pasión y recogimiento).',
        trivia: 'Innovación acústica: Los capiteles con hiperboloides permiten una difusión del sonido del órgano sin reverberación hueca.',
        photoAllowed: true,
        photoAngle: 'Mira hacia arriba hacia el claraboya central cuando el sol atraviesa los cristales ambarinos.'
      },
      {
        num: 3,
        name: 'Altar Mayor y Baldaquino Suspendido',
        roomOrHall: 'Presbiterio Central',
        direction: 'Frente al coro en el eje central de la basílica.',
        mustSeeArtwork: 'El Cristo crucificado suspendido bajo un baldaquino heptagonal iluminado con racimos de uvas doradas y espigas de trigo.',
        description: 'Una visión etérea y minimalista que parece flotar en el aire, rodeada por el órgano de tubos monumentales.',
        trivia: 'Simbología: El baldaquino de siete lados representa los siete dones del Espíritu Santo.',
        photoAllowed: true
      },
      {
        num: 4,
        name: 'Fachada de la Pasión',
        roomOrHall: 'Exterior / Carrer de Sardenya',
        direction: 'Sal por el portal oeste hacia la plaza exterior.',
        mustSeeArtwork: 'El cuadrado mágico de 16 casillas esculpido por Subirachs: sumes como sumes (filas, columnas o diagonales), el resultado siempre es 33 (la edad de Cristo).',
        description: 'Contraste radical con el Nacimiento: figuras geométricas, angulares, duras y desnudas que evocan el dolor y el sacrificio.',
        trivia: 'Pop Culture / Homenaje: Una de las figuras de los soldados romanos con casco lleva el diseño exacto de las chimeneas guerreras de La Pedrera de Gaudí.',
        photoAllowed: true,
        photoAngle: 'Captura el cuadrado mágico junto al beso de Judas.'
      },
      {
        num: 5,
        name: 'Museo Subterráneo y Taller de Maquetas',
        roomOrHall: 'Cripta y Planta Subterránea',
        direction: 'Baja las escaleras hacia el museo histórico bajo la nave de la Pasión.',
        mustSeeArtwork: 'Las maquetas polifuniculares: sacos de perdigones colgados de cuerdas invertidas con las que Gaudí calculaba la gravedad de los arcos.',
        description: 'Explica cómo las leyes de la naturaleza y la geometría reglada permitieron levantar la iglesia más alta del mundo sin arbotantes góticos.',
        trivia: 'Tumba de Gaudí: El arquitecto descansa enterrado en la capilla del Carmen dentro de la cripta subterránea.',
        photoAllowed: true
      }
    ]
  }
};
