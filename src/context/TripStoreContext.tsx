import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, query, orderBy, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { 
  Trip, TripMember, Destination, DayItinerary, Activity, 
  Accommodation, Transport, WalkingTour, Expense, Settlement, CityCode, Voucher 
} from '../types';
import { INITIAL_INTERNAL_MONUMENT_TOURS } from '../data/monumentToursData';
import { logout as authLogout } from '../lib/auth';

const CURRENT_TRIP_ID = 'TRIP_CURRENT';

export const DEFAULT_DESTINATIONS: Record<string, Destination> = {
  ROMA: {
    id: 'ROMA',
    code: 'ROMA',
    name: 'Roma',
    country: 'Italia',
    currency: 'EUR',
    timezone: 'Europe/Rome',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    gradientStops: ['#ea580c', '#eab308'],
    flagEmoji: '🇮🇹'
  },
  LONDRES: {
    id: 'LONDRES',
    code: 'LONDRES',
    name: 'Londres',
    country: 'Reino Unido',
    currency: 'GBP',
    timezone: 'Europe/London',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    gradientStops: ['#2563eb', '#dc2626'],
    flagEmoji: '🇬🇧'
  },
  OXFORD: {
    id: 'OXFORD',
    code: 'OXFORD',
    name: 'Oxford',
    country: 'Reino Unido',
    currency: 'GBP',
    timezone: 'Europe/London',
    coordinates: { lat: 51.7520, lng: -1.2577 },
    gradientStops: ['#1e3a8a', '#7e22ce'],
    flagEmoji: '🇬🇧'
  },
  BARCELONA: {
    id: 'BARCELONA',
    code: 'BARCELONA',
    name: 'Barcelona',
    country: 'España',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 41.3879, lng: 2.1699 },
    gradientStops: ['#0891b2', '#f59e0b'],
    flagEmoji: '🇪🇸'
  },
  GIRONA: {
    id: 'GIRONA',
    code: 'GIRONA',
    name: 'Girona',
    country: 'España',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 41.9794, lng: 2.8214 },
    gradientStops: ['#059669', '#b45309'],
    flagEmoji: '🇪🇸'
  },
  MADRID: {
    id: 'MADRID',
    code: 'MADRID',
    name: 'Madrid',
    country: 'España',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    gradientStops: ['#dc2626', '#f97316'],
    flagEmoji: '🇪🇸'
  },
  TOLEDO: {
    id: 'TOLEDO',
    code: 'TOLEDO',
    name: 'Toledo',
    country: 'España',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 39.8628, lng: -4.0273 },
    gradientStops: ['#d97706', '#78350f'],
    flagEmoji: '🇪🇸'
  },
  TRANSITO: {
    id: 'TRANSITO',
    code: 'TRANSITO',
    name: 'Tránsito / Ezeiza',
    country: 'Argentina',
    currency: 'USD',
    timezone: 'America/Argentina/Buenos_Aires',
    coordinates: { lat: -34.8222, lng: -58.5358 },
    gradientStops: ['#3b82f6', '#93c5fd'],
    flagEmoji: '✈️'
  }
};

interface TripStoreContextType {
  trip: Trip | null;
  members: TripMember[];
  travelers: TripMember[];
  destinations: Record<string, Destination>;
  itinerary: DayItinerary[];
  activities: Activity[];
  accommodations: Record<string, Accommodation>;
  transports: Record<string, Transport>;
  vouchers: Record<string, Voucher>;
  tours: Record<string, WalkingTour>;
  walkingTours: Record<string, WalkingTour>;
  internalTours: Record<string, WalkingTour>;
  expenses: Expense[];
  settlements: Settlement[];
  config: any;
  loading: boolean;
  activeMember: TripMember | null;
  userSession: TripMember | null;
  setActiveMember: (m: TripMember | null) => void;
  isGuest: boolean;
  isLockScreenOpen: boolean;
  setIsLockScreenOpen: (open: boolean) => void;
  handleLogout: () => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  themeCity: CityCode;
  setThemeCity: (city: CityCode) => void;
  currentDestination: Destination;
  customPalettes: Record<string, { primary: string; secondary: string }>;
  setCityPalette: (city: string, primary: string, secondary: string) => void;
  getDayData: (dayNumber: number) => DayItinerary | undefined;
  getTourById: (id: string) => WalkingTour | null;
  mutateExpense: (id: string, data: any, isDelete?: boolean) => Promise<void>;
  mutateSettlement: (id: string, data: any, isDelete?: boolean) => Promise<void>;
  addExpense: (exp: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const TripStoreContext = createContext<TripStoreContextType | undefined>(undefined);

export const TripStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [destinations, setDestinations] = useState<Record<string, Destination>>(DEFAULT_DESTINATIONS);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [accommodations, setAccommodations] = useState<Record<string, Accommodation>>({});
  const [transports, setTransports] = useState<Record<string, Transport>>({});
  const [vouchers, setVouchers] = useState<Record<string, Voucher>>({});
  const [tours, setTours] = useState<Record<string, WalkingTour>>({});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  // User Authentication & Session
  const [activeMember, setActiveMember] = useState<TripMember | null>(() => {
    const saved = localStorage.getItem('trip_active_member');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLockScreenOpen, setIsLockScreenOpen] = useState(false);

  // Theme & City Gradient
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('trip_theme') as 'dark' | 'light') || 'dark';
  });
  const [themeCity, setThemeCityState] = useState<CityCode>('ROMA');
  const [customPalettes, setCustomPalettes] = useState<Record<string, { primary: string; secondary: string }>>(() => {
    const saved = localStorage.getItem('trip_custom_palettes');
    return saved ? JSON.parse(saved) : {};
  });

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('trip_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setThemeCity = (city: CityCode) => {
    setThemeCityState(city);
  };

  const setCityPalette = (city: string, primary: string, secondary: string) => {
    const updated = { ...customPalettes, [city]: { primary, secondary } };
    setCustomPalettes(updated);
    localStorage.setItem('trip_custom_palettes', JSON.stringify(updated));
  };

  const handleLogout = async () => {
    setActiveMember(null);
    localStorage.removeItem('trip_active_member');
    await authLogout().catch(() => {});
    setIsLockScreenOpen(true);
  };

  // Keep localStorage synced with active member
  useEffect(() => {
    if (activeMember) {
      localStorage.setItem('trip_active_member', JSON.stringify(activeMember));
    }
  }, [activeMember]);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const tripRef = doc(db, 'trips', CURRENT_TRIP_ID);

    // Trip Master Document
    const unsubTrip = onSnapshot(tripRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTrip({ id: snap.id, ...data } as Trip);
      }
    });

    // Members
    const unsubMembers = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/members`), (snap) => {
      const mems = snap.docs.map(d => ({ id: d.id, ...d.data() } as TripMember));
      setMembers(mems);
      // Auto-assign first member if none selected
      if (!activeMember && mems.length > 0) {
        const saved = localStorage.getItem('trip_active_member');
        if (!saved) {
          setActiveMember(mems[0]);
        }
      }
    });

    // Destinations
    const unsubDests = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/destinations`), (snap) => {
      if (!snap.empty) {
        const map: Record<string, Destination> = { ...DEFAULT_DESTINATIONS };
        snap.docs.forEach(d => {
          const item = { id: d.id, ...d.data() } as Destination;
          map[item.code || d.id] = item;
        });
        setDestinations(map);
      }
    });

    // Itinerary Days
    const unsubItin = onSnapshot(query(collection(db, `trips/${CURRENT_TRIP_ID}/itinerary_days`), orderBy('dayIndex')), (snap) => {
      const days = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          day: data.dayIndex || data.day || 1,
          dayIndex: data.dayIndex || 1,
          date: data.date || '',
          dateLabel: data.dateLabel || '',
          cityCode: data.cityCode || 'ROMA',
          city: data.city || 'Roma',
          title: data.title || data.dayTitle || '',
          alerts: data.alerts || '',
          clothes: data.clothes || '',
          timezone: data.timezone,
          transportId: data.transportId,
          accommodationId: data.accommodationId,
          updatedAt: data.updatedAt
        } as DayItinerary;
      });
      setItinerary(days);
    });

    // Activities
    const unsubActivities = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/activities`), (snap) => {
      const acts = snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity));
      setActivities(acts);
    });

    // Accommodations
    const unsubAcc = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/accommodations`), (snap) => {
      const map: Record<string, Accommodation> = {};
      snap.docs.forEach(d => {
        map[d.id] = { id: d.id, ...d.data() } as Accommodation;
      });
      setAccommodations(map);
    });

    // Transports
    const unsubTrans = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/transports`), (snap) => {
      const map: Record<string, Transport> = {};
      snap.docs.forEach(d => {
        map[d.id] = { id: d.id, ...d.data() } as Transport;
      });
      setTransports(map);
    });

    // Vouchers
    const unsubVouchers = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/vouchers`), (snap) => {
      const map: Record<string, Voucher> = {};
      snap.docs.forEach(d => {
        map[d.id] = { id: d.id, ...d.data() } as Voucher;
      });
      setVouchers(map);
    });

    // Tours (Walking & Monument)
    const unsubTours = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/tours`), (snap) => {
      const map: Record<string, WalkingTour> = { ...INITIAL_INTERNAL_MONUMENT_TOURS };
      snap.docs.forEach(d => {
        const data = d.data();
        map[d.id] = {
          id: d.id,
          title: data.title || '',
          cityCode: data.cityCode || 'ROMA',
          duration: data.duration || '',
          distance: data.distance || '',
          pace: data.pace || '',
          fullMapsUrl: data.mapsRouteUrl1 || data.fullMapsUrl || '',
          mapsRouteUrl1: data.mapsRouteUrl1,
          mapsRouteUrl2: data.mapsRouteUrl2,
          tip: data.routeTip || data.tip || '',
          rec: data.veggieRecommendation || data.rec || '',
          wc: data.publicWc || data.wc || '',
          stops: data.stops || [],
          updatedAt: data.updatedAt
        } as WalkingTour;
      });
      setTours(map);
      setLoading(false);
    });

    // Expenses
    const unsubExpenses = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/expenses`), (snap) => {
      const exps = snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense));
      setExpenses(exps);
    });

    // Settlements
    const unsubSettlements = onSnapshot(collection(db, `trips/${CURRENT_TRIP_ID}/settlements`), (snap) => {
      const sets = snap.docs.map(d => ({ id: d.id, ...d.data() } as Settlement));
      setSettlements(sets);
    });

    const fallbackTimer = setTimeout(() => setLoading(false), 800);

    return () => {
      clearTimeout(fallbackTimer);
      unsubTrip();
      unsubMembers();
      unsubDests();
      unsubItin();
      unsubActivities();
      unsubAcc();
      unsubTrans();
      unsubVouchers();
      unsubTours();
      unsubExpenses();
      unsubSettlements();
    };
  }, []);

  // Compute current active destination with fallback
  const currentDestination = useMemo(() => {
    const code = (themeCity || 'ROMA').toUpperCase();
    return destinations[code] || destinations.ROMA || DEFAULT_DESTINATIONS.ROMA;
  }, [destinations, themeCity]);

  // Synchronize CSS custom properties when current destination or palette changes
  useEffect(() => {
    const root = document.documentElement;
    const code = currentDestination.code || 'ROMA';
    const custom = customPalettes[code];

    const primary = custom?.primary || currentDestination.gradientStops?.[0] || '#ea580c';
    const secondary = custom?.secondary || currentDestination.gradientStops?.[1] || '#eab308';

    root.style.setProperty('--city-primary', primary);
    root.style.setProperty('--city-secondary', secondary);
    root.style.setProperty('--city-glow', `${primary}33`);
  }, [currentDestination, customPalettes]);

  // Computed config object with pre-trip balances & currency rates
  const config = useMemo(() => {
    return {
      preTripMatiasUSD: trip?.preTripTotals?.matiasUsd ?? 1845,
      preTripAriUSD: trip?.preTripTotals?.arielUsd ?? 645,
      currencyRates: trip?.rates ?? { EUR: 1.08, GBP: 1.28, USD: 1.0 },
      baseCurrency: trip?.baseCurrency || 'USD',
      driveFolderUrl: trip?.driveFolderUrl || ''
    };
  }, [trip]);

  // Helpers
  const getDayData = useCallback((dayNumber: number): DayItinerary | undefined => {
    const found = itinerary.find(d => Number(d.day) === Number(dayNumber) || Number(d.dayIndex) === Number(dayNumber));
    if (!found) return undefined;
    const dayActs = activities.filter(a => Number(a.dayIndex) === Number(dayNumber) || Number(a.dayNumber) === Number(dayNumber));
    return {
      ...found,
      activities: dayActs
    };
  }, [itinerary, activities]);

  const getTourById = useCallback((id: string): WalkingTour | null => {
    return tours[id] || INITIAL_INTERNAL_MONUMENT_TOURS[id] || null;
  }, [tours]);

  // Firestore Mutators
  const mutateExpense = async (id: string, data: any, isDelete = false) => {
    const ref = doc(db, 'trips', CURRENT_TRIP_ID, 'expenses', id);
    if (isDelete) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        ...data,
        id,
        updatedAt: Date.now(),
        createdAt: data.createdAt || Date.now()
      }, { merge: true });
    }
  };

  const mutateSettlement = async (id: string, data: any, isDelete = false) => {
    const ref = doc(db, 'trips', CURRENT_TRIP_ID, 'settlements', id);
    if (isDelete) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        ...data,
        id,
        updatedAt: Date.now(),
        createdAt: data.createdAt || Date.now()
      }, { merge: true });
    }
  };

  const addExpense = async (exp: Expense) => {
    await mutateExpense(exp.id, exp, false);
  };

  const deleteExpense = async (id: string) => {
    await mutateExpense(id, {}, true);
  };

  const isGuest = !activeMember || (activeMember as any).role === 'GUEST';

  const value = {
    trip,
    members,
    travelers: members,
    destinations,
    itinerary,
    activities,
    accommodations,
    transports,
    vouchers,
    tours,
    walkingTours: tours,
    internalTours: INITIAL_INTERNAL_MONUMENT_TOURS,
    expenses,
    settlements,
    config,
    loading,
    activeMember,
    userSession: activeMember,
    setActiveMember,
    isGuest,
    isLockScreenOpen,
    setIsLockScreenOpen,
    handleLogout,
    theme,
    setTheme,
    toggleTheme,
    themeCity,
    setThemeCity,
    currentDestination,
    customPalettes,
    setCityPalette,
    getDayData,
    getTourById,
    mutateExpense,
    mutateSettlement,
    addExpense,
    deleteExpense
  };

  return (
    <TripStoreContext.Provider value={value}>
      {children}
    </TripStoreContext.Provider>
  );
};

export function useTripStore() {
  const context = useContext(TripStoreContext);
  if (!context) {
    throw new Error('useTripStore must be used within a TripStoreProvider');
  }
  return context;
}
