const admin = require('firebase-admin');
const { getFirestore,storage, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

require('dotenv').config();
// Initialize the Firebase Admin app here
admin.initializeApp({
  // Replace with your Firebase project configuration (from firebaseConfig.json)
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    
    // ... other firebaseConfig.json properties (if needed)
  }),
  storageBucket:"mobileapp-bbc7c.appspot.com"
});

const firestore = getFirestore(admin.app());

module.exports = firestore;
