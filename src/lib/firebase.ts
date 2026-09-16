import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  memoryLocalCache, 
  getFirestore, 
  Firestore 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const isBrowser = typeof window !== 'undefined';
const dbId = (firebaseConfig as any).firestoreDatabaseId || undefined;

let dbInstance: Firestore;

try {
  dbInstance = initializeFirestore(app, {
    localCache: isBrowser ? persistentLocalCache({}) : memoryLocalCache(),
    experimentalForceLongPolling: isBrowser,
  }, dbId);
} catch (e) {
  try {
    dbInstance = getFirestore(app, dbId);
  } catch (err) {
    dbInstance = initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: isBrowser,
    }, dbId);
  }
}

export const db = dbInstance;
export default app;

