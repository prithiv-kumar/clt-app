

// const admin = require('firebase-admin');
// const firestore = require('../../db'); // Assuming connection setup elsewhere
// const usersCollection = firestore.collection('users');
// const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

// const getbill = async (req, res) => {
//   try {
//     const snapshot = await tripsCollection.get();
//     if (snapshot.empty) {
//       return res.send({ success: true, data: [] }); // No matching trips found
//     }

//     const tripData = [];
//     for (const doc of snapshot.docs) {
//       const trip = doc.data();
//       const uid = trip.uid; // Get the UID from the trip document
//       const fname = trip.name;
//       const email = trip.email;
//       const date = trip.date;
//       const tariff = trip.Trip_fare + trip.Additional_fares;
//       const distance = trip.distance;
//       const billno = trip.billNumber;

//       const userSnapshot = await usersCollection.where('uid', '==', uid).get(); // Fetch matching user data
//       if (!userSnapshot.empty) {
//         const userData = userSnapshot.docs[0].data();
//         const fullname = userData.fullname; // Assuming 'fullname' field in users
//         console.log(`Full name for trip ${uid}: ${fullname}`); // Log the full name
//         tripData.push({
//           driver: fullname,
//           customer: fname,
//           customer_email: email,
//           date: date,
//           tariff: tariff,
//           distance: distance,
//           billNumber: billno,
//         });
//       } else {
//         console.warn(`User with UID ${uid} not found in users collection.`);
//         // Handle missing user data (optional: exclude trip or provide default)
//       }
//     }

//     res.send({ success: true, data: tripData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to fetch trip details' });
//   }
// };

// module.exports = { getbill };


const admin = require('firebase-admin'); // Require the Firebase Admin SDK

const firestore = require('../../db'); // Assuming connection setup elsewhere
// This line likely imports a module or code snippet that establishes a connection to Firestore

const usersCollection = firestore.collection('users');
const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const PAGE_SIZE = 10; // Adjust this value to define the number of trips per page

const getbill = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;

    let query = tripsCollection.orderBy('date').limit(limit + 1); // Get trips ordered by date, with one extra document

    if (page > 1) {
      const lastVisibleDoc = await tripsCollection.orderBy('date').limit((page - 1) * limit).get();
      if (!lastVisibleDoc.empty) {
        const lastDoc = lastVisibleDoc.docs[lastVisibleDoc.docs.length - 1];
        query = query.startAfter(lastDoc); // Start after the last document of the previous page
      }
    }

    const snapshot = await query.get(); // Execute the query

    if (snapshot.empty) {
      return res.send({ success: true, data: [], nextPage: false }); // No trips found
    }

    const tripData = [];
    let nextPage = false;

    for (let i = 0; i < limit; i++) { // Process only limit documents (skipping the extra one)
      const doc = snapshot.docs[i];
      if (!doc) break; // Handle potential extra document

      const trip = doc.data();
      const uid = trip.uid;

      const fname = trip.name;
      const email = trip.email;
      const date = trip.date;
      const tariff = trip.Trip_fare + trip.Additional_fares;
      const distance = trip.distance;
      const billno = trip.billNumber;

      const userSnapshot = await usersCollection.where('uid', '==', uid).get(); // Fetch matching user data
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const fullname = userData.fullname; // Assuming 'fullname' field in users
        console.log(`Full name for trip ${uid}: ${fullname}`); // Log the full name
        tripData.push({
          driver: fullname,
          customer: fname,
          customer_email: email,
          date: date,
          tariff: tariff,
          distance: distance,
          billNumber: billno,
        });
      } else {
        console.warn(`User with UID ${uid} not found in users collection.`);
        // Handle missing user data (optional: exclude trip or provide default)
      }
    }

    nextPage = snapshot.size > limit; // Check if there are more documents for next page (based on retrieved document count)

    res.send({ success: true, data: tripData, nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { getbill };
