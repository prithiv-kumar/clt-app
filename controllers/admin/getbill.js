

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
          distance: distance
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

