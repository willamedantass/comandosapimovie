import * as admin from 'firebase-admin';
import path from 'path';

const FIREBASE_PATH = path.join(__dirname, '..', '..', 'movvnow-firebase.json')
admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_PATH)
});

export const Firestore = admin.firestore();
