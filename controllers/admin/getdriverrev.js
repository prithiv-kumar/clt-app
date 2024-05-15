const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere
const usersCollection = firestore.collection('users');
const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const getdriverrev = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    if (snapshot.empty) {
      return res.send({ success: true, data: [] }); // No matching trips found
    }
    let driverData = [];

    for (const doc of snapshot.docs) {
      let trip = 0;
      let revenue = 0;

      const driver = doc.data();
      const uid = driver.uid; // Get the UID from the driver document
      const fullname = driver.fullname;
      const email = driver.email;
      const veh_model = driver.vehicle_make_model;
      const phone = driver.phone;

      const userSnapshot = await tripsCollection.where('uid', '==', uid).get(); // Fetch matching user data

      if (!userSnapshot.empty) {
        for (const doc of userSnapshot.docs) {
          const userData = doc.data();
          trip++; // Assuming 'fullname' field in users
          revenue += userData.Additional_fares + userData.Trip_fare;
        }
        driverData.push({
          email: email,
          fullname: fullname,
          veh_model: veh_model,
          phone: phone,
          trips: trip,
          revenue: revenue,
        });
      } else {
        console.warn(`User with UID ${uid} not found in trips collection.`);
        // Handle missing user data (optional: exclude trip or provide default)
      }
    }

    res.send({ success: true, data: driverData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { getdriverrev };
