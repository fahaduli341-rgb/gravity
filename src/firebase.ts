import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, setLogLevel, Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../firebase-applet-config.json';

// Silence Firestore internal connectivity warning logs
setLogLevel('silent');

// Intercept transient Cloud Firestore connection retry logs in browser runtime
if (typeof window !== 'undefined') {
  const origConsoleError = console.error;
  console.error = (...args: any[]) => {
    const firstArg = typeof args[0] === 'string' ? args[0] : '';
    if (
      firstArg.includes('Could not reach Cloud Firestore backend') ||
      firstArg.includes('@firebase/firestore')
    ) {
      console.warn('[Firestore Status]', ...args);
      return;
    }
    origConsoleError.apply(console, args);
  };
}

const app = getApps().length > 0 ? getApp() : initializeApp(config);

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
    },
    config.firestoreDatabaseId || undefined
  );
} catch {
  firestoreInstance = config.firestoreDatabaseId
    ? getFirestore(app, config.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);
export default app;
