

const PAGE_SIZE = 10; // Adjust this value to define the number of trips per page
const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere
const usersCollection = firestore.collection('users');
const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const getdriverrev = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;
    
    let driverQuery = usersCollection.orderBy('uid').limit(limit + 1); // Fetch drivers with an extra document for pagination

    if (page > 1) {
      const lastVisibleDoc = await usersCollection.orderBy('uid').limit((page - 1) * limit).get();
      if (!lastVisibleDoc.empty) {
        const lastDoc = lastVisibleDoc.docs[lastVisibleDoc.docs.length - 1];
        driverQuery = driverQuery.startAfter(lastDoc); // Start after the last document of the previous page
      }
    }

    const driverSnapshot = await driverQuery.get(); // Execute the query

    if (driverSnapshot.empty) {
      return res.send({ success: true, data: [], nextPage: false }); // No drivers found
    }

    const driverData = [];
    let nextPage = false;

    for (let i = 0; i < limit; i++) { // Process only limit documents (skipping the extra one)
      const driverDoc = driverSnapshot.docs[i];
      if (!driverDoc) break;

      let trip = 0;
      let revenue = 0;

      const driver = driverDoc.data();
      const uid = driver.uid; // Get the UID from the driver document
      const fullname = driver.fullname;
      const email = driver.email;
      const veh_model = driver.vehicle_make_model;
      const phone = driver.phone;

      const userSnapshot = await tripsCollection.where('uid', '==', uid).get(); // Fetch matching user data

      if (!userSnapshot.empty) {
        for (const tripDoc of userSnapshot.docs) {
          const userData = tripDoc.data();
          trip++; // Increment trip count
          revenue += userData.Additional_fares + userData.Trip_fare; // Sum up the revenue
        }
      } else {
        console.warn(`User with UID ${uid} not found in trips collection.`);
      }

      driverData.push({
        email: email,
        fullname: fullname,
        veh_model: veh_model,
        phone: phone,
        trips: trip,
        revenue: revenue,
      });
    }

    // Determine if there is a next page
    if (driverSnapshot.docs.length === limit + 1) {
      nextPage = true;
      driverData.pop(); // Remove the extra document used for pagination check
    }

    res.send({ success: true, data: driverData, nextPage: nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { getdriverrev };
