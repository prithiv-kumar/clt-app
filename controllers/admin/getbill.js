const admin = require('firebase-admin'); // Require the Firebase Admin SDK
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');
const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const PAGE_SIZE = 10; // Adjust this value to define the number of trips per page

const getbill = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;
    const nameQuery = req.query.name || ''; // Get the name from query parameter
    const dateQuery = req.query.date || ''; // Get the date from query parameter
    const fullnameQuery = req.query.fullname || ''; // Get the fullname from query parameter
    const billNumberQuery = req.query.billNumber ? parseInt(req.query.billNumber) : ''; // Get the bill number from query parameter and convert to number

    let query = tripsCollection;

    if (fullnameQuery) {
      const userSnapshot = await usersCollection.where('fullname', '==', fullnameQuery).get(); // Fetch matching users by fullname
      if (!userSnapshot.empty) {
        const uids = userSnapshot.docs.map(doc => doc.data().uid); // Extract UIDs of matching users
        query = query.where('uid', 'in', uids);
      } else {
        return res.send({ success: true, data: [], nextPage: false }); // No users found with the given fullname
      }
    }

    if (nameQuery) {
      query = query.where('name', '==', nameQuery);
    }

    if (dateQuery) {
      query = query.where('date', '==', dateQuery);
    }

    if (billNumberQuery) {
      console.log('Filtering by billNumber:', billNumberQuery);
      query = query.where('billNumber', '==', billNumberQuery);
    }

    query = query.orderBy('date').limit(limit + 1);

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

    res.send({
      success: true,
      data: tripData,
      nextPage,
    });
  } catch (error) {
    if (error.code === 9 && error.details && error.details.includes('The query requires an index')) {
      console.error('Firestore query requires an index. Create it here:', error.details);
      res.status(500).send({ message: 'Firestore query requires an index. Create it using the provided link in the error details.' });
    } else {
      console.error(error);
      res.status(500).send({ message: 'Failed to fetch trip details' });
    }
  }
};

module.exports = { getbill };
