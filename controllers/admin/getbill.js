

const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere
const usersCollection = firestore.collection('users');
const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const getbill = async (req, res) => {
  try {
    const snapshot = await tripsCollection.get();
    if (snapshot.empty) {
      return res.send({ success: true, data: [] }); // No matching trips found
    }

    const tripData = [];
    for (const doc of snapshot.docs) {
      const trip = doc.data();
      const uid = trip.uid; // Get the UID from the trip document
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

    res.send({ success: true, data: tripData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { getbill };


// const admin = require('firebase-admin');
// const firestore = require('../../db'); // Assuming connection setup elsewhere
// const usersCollection = firestore.collection('users');
// const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

// const PAGE_SIZE = 5; // Adjust this value to define the number of trips per page

// const getbill = async (req, res) => {
//   try {
//     const { page = 1 } = req.query; // Get the current page number from query parameter (default 1)

//     const snapshot = await tripsCollection
//       .orderBy('date') // Optional: Order by date (adjust as needed)
//       .limit(PAGE_SIZE)
//       .startAfter((page - 1) * PAGE_SIZE) // Get documents based on page and page size
//       .get();

//     if (snapshot.empty) {
//       return res.send({ success: true, data: [], hasMore: false }); // No matching trips found
//     }

//     const tripData = [];
//     for (const doc of snapshot.docs) {
//       const trip = doc.data();
//       const uid = trip.uid;
//       const fname = trip.name;
//       const email = trip.email;
//       const date = trip.date;
//       const tariff = trip.Trip_fare + trip.Additional_fares;
//       const distance = trip.distance;
//       const billno = trip.billNumber;

//       const userSnapshot = await usersCollection.where('uid', '==', uid).get();
//       if (!userSnapshot.empty) {
//         const userData = userSnapshot.docs[0].data();
//         const fullname = userData.fullname; // Assuming 'fullname' field in users
//         console.log(`Full name for trip ${uid}: ${fullname}`);
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

//     const hasMore = snapshot.size === PAGE_SIZE; // Check if there are more pages

//     res.send({ success: true, data: tripData, hasMore });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to fetch trip details' });
//   }
// };

// module.exports = { getbill };
