import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { 
  Trip, TripMember, Destination, ItineraryDay, Activity, 
  Accommodation, Transport, Tour, Expense, Settlement 
} from '../types';

export const TRIP_COLLECTION = 'trips';
export const CURRENT_TRIP_ID = 'TRIP_CURRENT';

export interface FirestoreTripBundle {
  trip?: Trip;
  members: TripMember[];
  destinations: Record<string, Destination>;
  itinerary: ItineraryDay[];
  activities: Activity[];
  accommodations: Record<string, Accommodation>;
  transports: Record<string, Transport>;
  tours: Record<string, Tour>; // walking and internal
  expenses: Expense[];
  settlements: Settlement[];
}

export function subscribeToTripBundle(
  tripId: string,
  onUpdate: (data: Partial<FirestoreTripBundle>) => void
) {
  const tripRef = doc(db, TRIP_COLLECTION, tripId);
  const unsubs: (() => void)[] = [];

  // Listen to trip doc
  unsubs.push(onSnapshot(tripRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      onUpdate({ 
        trip: { id: snap.id, ...data } as Trip 
      });
      // Handle legacy embedded destinations if present
      if (data.destinations && Array.isArray(data.destinations)) {
        const dests: Record<string, Destination> = {};
        data.destinations.forEach((d: Destination) => dests[d.code] = d);
        onUpdate({ destinations: dests });
      }
    }
  }));

  const listenCollection = <T>(
    colName: string, 
    transform: (docs: any[]) => Partial<FirestoreTripBundle>
  ) => {
    unsubs.push(onSnapshot(collection(tripRef, colName), (snap) => {
      // Filter out soft-deleted docs
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((d: any) => !d.deletedAt);
      onUpdate(transform(docs));
    }));
  };

  listenCollection('itinerary_days', docs => ({
    itinerary: (docs as ItineraryDay[]).sort((a, b) => a.dayIndex - b.dayIndex)
  }));

  listenCollection('activities', docs => ({
    activities: (docs as Activity[]).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }));

  listenCollection('expenses', docs => ({ expenses: docs as Expense[] }));
  listenCollection('settlements', docs => ({ settlements: docs as Settlement[] }));
  listenCollection('members', docs => ({ members: docs as TripMember[] }));
  
  listenCollection('accommodations', docs => {
    const acc: Record<string, Accommodation> = {};
    docs.forEach(d => acc[d.id] = d as Accommodation);
    return { accommodations: acc };
  });

  listenCollection('transports', docs => {
    const trans: Record<string, Transport> = {};
    docs.forEach(d => trans[d.id] = d as Transport);
    return { transports: trans };
  });

  listenCollection('tours', docs => {
    const tours: Record<string, Tour> = {};
    docs.forEach(d => tours[d.id] = d as Tour);
    return { tours: tours };
  });

  return () => unsubs.forEach(fn => fn());
}

export async function mutateEntity(tripId: string, collectionName: string, entityId: string, data: any, isDelete = false) {
  const ref = doc(db, TRIP_COLLECTION, tripId, collectionName, entityId);
  if (isDelete) {
    // Soft Delete Implementation
    await updateDoc(ref, {
      deletedAt: Date.now(),
      updatedAt: Date.now()
    });
  } else {
    // Upsert
    await setDoc(ref, {
      ...data,
      tripId,
      updatedAt: Date.now(),
      createdAt: data.createdAt || Date.now()
    }, { merge: true });
  }
}
