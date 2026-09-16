import React, { useState } from 'react';
import { 
  Info, 
  Leaf, 
  Headphones, 
  ShoppingCart, 
  HelpCircle, 
  ExternalLink, 
  Sparkles,
  Search,
  CheckCircle2,
  Coffee,
  BatteryCharging,
  CreditCard,
  Droplets
} from 'lucide-react';

interface SupermarketGuideItem {
  chain: string;
  country: string;
  city: string;
  highlights: string;
  veggieOptions: string[];
  budgetLevel: '€' | '€€' | '€€€';
}

interface AudioguideItem {
  attractionName: string;
  city: string;
  bookingCode: string;
  appName: string;
  notes: string;
  appUrl?: string;
  icon?: string;
}

const VEGGIE_SUPERMARKET_GUIDE: SupermarketGuideItem[] = [
  {
    chain: "Tesco Express & Sainsbury's Local",
    country: "Reino Unido",
    city: "Londres & Oxford",
    highlights: "Los famosos 'Meal Deals' (£3.60 - £4.00 con Clubcard / tarjeta) incluyen un plato principal (sandwich o bowl), un snack (patatas, fruta o hummus) y una bebida fría.",
    veggieOptions: ["Sandwich Wicked Kitchen Vegan", "Falafel & Houmous Wrap", "Ensaladas Plant Chef", "Smoothies Innocent"],
    budgetLevel: "€"
  },
  {
    chain: "Marks & Spencer Simply Food (M&S)",
    country: "Reino Unido",
    city: "Londres & Oxford",
    highlights: "Línea gourmet 'Plant Kitchen'. Comida preparada fresca de alta calidad, perfecta para picnics en Hyde Park o Regent's Park.",
    veggieOptions: ["Plant Kitchen No-Beef Pasty", "Veggie Sushi Roll", "Ensalada de Quinoa y Aguacate", "Yogures de coco"],
    budgetLevel: "€€"
  },
  {
    chain: "Mercadona",
    country: "España",
    city: "Barcelona & Madrid",
    highlights: "Sección 'Listo para Comer' con platos vegetarianos calientes y fríos al peso. Marca blanca Hacendado con amplias alternativas 100% vegetales a precios imbatibles.",
    veggieOptions: ["Gazpacho / Salmorejo fresco", "Tortilla de patatas sin cebolla / con cebolla", "Hummus clásico y de pimientos", "Bocadillos vegetales", "Bebidas de avena y soja"],
    budgetLevel: "€"
  },
  {
    chain: "Carrefour Express & Carrefour Market",
    country: "España",
    city: "Barcelona & Madrid",
    highlights: "Línea 'Carrefour Veggie'. Muy abundantes en barrios céntricos (Eixample, Sol, Malasaña). Cuentan con frutas cortadas listas para comer y ensaladas al paso.",
    veggieOptions: ["Empanadas vegetales", "Ensaladas Carrefour Veggie", "Tofu marinado y tempeh", "Bocadillos de queso brie y vegetales"],
    budgetLevel: "€€"
  },
  {
    chain: "Conad City & Coop",
    country: "Italia",
    city: "Roma",
    highlights: "Excelente panadería y quesos locales. Las líneas 'Verso Natura Conad' y 'Vivi Verde Coop' cuentan con abundantes productos bio, vegetales y sin lactosa.",
    veggieOptions: ["Focaccia al rosmarino", "Panini mozzarella e pomodoro", "Insalata di riso vegetariana", "Pesto senz'aglio e pasta fresca"],
    budgetLevel: "€€"
  },
  {
    chain: "NaturaSì (Supermercado Bio)",
    country: "Italia",
    city: "Roma",
    highlights: "La mayor cadena orgánica de Italia con sucursal cerca de Termini y Trastevere. Amplio surtido de platos 100% veganos y snacks para caminatas largas.",
    veggieOptions: ["Torta salata alle verdure", "Biscotti vegani artigianali", "Kombucha & succhi bio", "Formaggi vegetali"],
    budgetLevel: "€€€"
  }
];

const OFFICIAL_AUDIOGUIDES: AudioguideItem[] = [
  {
    attractionName: "Museos Vaticanos & Capilla Sixtina",
    city: "Roma",
    bookingCode: "VAT-AUDIO",
    appName: "Musei Vaticani App Oficial",
    notes: "Descargar el contenido offline antes de llegar con el WiFi del hotel. Llevar auriculares con cable o Bluetooth (en la Capilla Sixtina rige silencio absoluto).",
    appUrl: "https://www.museivaticani.va/"
  },
  {
    attractionName: "Coliseo, Foro Romano & Monte Palatino",
    city: "Roma",
    bookingCode: "PARCO-COLOSSEO",
    appName: "Parco Colosseo App (Y&D)",
    notes: "App oficial gratuita con mapas interactivos GPS de los recorridos del Foro y Palatino sin necesidad de consumir datos móviles.",
    appUrl: "https://parcocolosseo.it/"
  },
  {
    attractionName: "Basílica de la Sagrada Família",
    city: "Barcelona",
    bookingCode: "SAGRADA-APP",
    appName: "Sagrada Família Oficial",
    notes: "La entrada oficial incluye audioguía en la App en español. Requiere validar el código de reserva en la aplicación para activar el recorrido guiado.",
    appUrl: "https://sagradafamilia.org/es/app"
  },
  {
    attractionName: "British Museum",
    city: "Londres",
    bookingCode: "BM-AUDIO",
    appName: "British Museum Audio App",
    notes: "Disponible en Google Play y App Store. Incluye mapa interactivo sala por sala y recorrido de los 10 objetos imperdibles (Piedra Rosetta, momias, etc.).",
    appUrl: "https://www.britishmuseum.org/"
  },
  {
    attractionName: "Museo Nacional del Prado",
    city: "Madrid",
    bookingCode: "PRADO-GUIDE",
    appName: "Guía Oficial Museo del Prado",
    notes: "Incluye las 50 obras maestras con explicaciones detalladas de alta calidad sonora. Ideal para recorrer Las Meninas y el Jardín de las Delicias.",
    appUrl: "https://www.museodelprado.es/"
  },
  {
    attractionName: "Palacio Real de Madrid",
    city: "Madrid",
    bookingCode: "PATRIMONIO-APP",
    appName: "Patrimonio Nacional App",
    notes: "Audioguía interactiva de las estancias reales, la Real Armería y la Real Botica con audioguía en español.",
    appUrl: "https://www.patrimonionacional.es/"
  }
];

export const GuideView: React.FC = () => {
  const [filterCountry, setFilterCountry] = useState<string>('ALL');

  const filteredSupermarkets = filterCountry === 'ALL'
    ? VEGGIE_SUPERMARKET_GUIDE
    : VEGGIE_SUPERMARKET_GUIDE.filter(s => s.country.toLowerCase().includes(filterCountry.toLowerCase()));

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-[2rem] border border-[var(--border-card)] shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-[var(--city-primary)] text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Guía Práctica del Viajero & Opciones Veggie</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
          Supermercados, Opciones Vegetarianas & Audioguías
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Cadenas recomendadas en Italia, Reino Unido y España, Meal Deals económicos y enlaces oficiales de descarga de audioguías.
        </p>
      </div>

      {/* Universal Travel Hacks */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Consejos Universales para el Viaje
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <BatteryCharging size={16} />
              <span>Batería & Power Bank</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Llevar siempre un Power Bank de al menos 10.000 mAh en la mochila. En museos y caminatas con GPS el celular consume batería rápido.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CreditCard size={16} />
              <span>Tarjetas Contactless</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              En el Tube de Londres, trenes de Roma y buses de Barcelona pueden apoyar directamente la tarjeta contactless física o Apple Pay / Google Pay.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-1.5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <Droplets size={16} />
              <span>Agua Potable Gratis</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              En Roma usen los nasoni de hierro fundido. En Londres pidan "tap water" en pubs y restaurantes (es gratis por ley). En Barcelona y Madrid el agua de grifo es 100% segura.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Coffee size={16} />
              <span>Costumbres Locales</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              En Italia pedir espresso en la barra suele costar 1.20 - 1.50 € (sentarse en mesa puede triplicar el precio por servicio). En España el menú del día al mediodía es la opción más económica.
            </p>
          </div>
        </div>
      </div>

      {/* Official Audioguides Grid */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-[var(--city-primary)]" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Audioguías Oficiales Pre-descargables
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--city-glow)] text-[var(--city-primary)]">
            6 Monumentos
          </span>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          Descarga las apps oficiales antes de salir de cada alojamiento para no gastar datos móviles y llevar tus propios auriculares.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {OFFICIAL_AUDIOGUIDES.map((ag, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-2.5 transition-all hover:border-[var(--city-primary)]/40 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                    {ag.attractionName}
                  </h4>
                  <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                    {ag.city}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--city-glow)] text-[var(--city-primary)] font-bold shrink-0 border border-[var(--city-primary)]/20">
                  {ag.bookingCode}
                </span>
              </div>

              <div className="text-xs font-semibold text-[var(--city-primary)] flex items-center gap-1.5">
                <span>📱 {ag.appName}</span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {ag.notes}
              </p>

              {ag.appUrl && (
                <div className="pt-1">
                  <a
                    href={ag.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--city-primary)] hover:underline font-bold"
                  >
                    <span>Sitio Oficial / Descarga</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Supermarket & Veggie Guide */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Supermercados & Opciones Vegetarianas
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'Italia', label: '🇮🇹 Roma' },
              { id: 'Reino Unido', label: '🇬🇧 Londres / Oxford' },
              { id: 'España', label: '🇪🇸 Barcelona / Madrid' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterCountry(f.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                  filterCountry === f.id
                    ? 'bg-[var(--city-glow)] text-[var(--city-primary)] border-[var(--city-primary)] shadow-xs'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-card)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {filteredSupermarkets.map((sg, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <ShoppingCart size={15} className="text-emerald-400" />
                    <span>{sg.chain}</span>
                  </h4>
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    {sg.country} • {sg.city}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  {sg.budgetLevel}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {sg.highlights}
              </p>

              {/* Veggie bullet tags */}
              <div className="space-y-1 pt-1 border-t border-[var(--border-card)]">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block tracking-wider">
                  Recomendados Veggie:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sg.veggieOptions.map((opt, oIdx) => (
                    <span 
                      key={oIdx} 
                      className="px-2 py-0.5 rounded-lg bg-white/5 text-[var(--text-primary)] border border-white/10 text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />
                      <span>{opt}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
