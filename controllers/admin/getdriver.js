

const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');
const trips = firestore.collection('customers');

const getUserDetails = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const tripSnapshot = await trips.get();

    // Create an empty array to store user data with name
    let DriverData = [];
    let driverCount = 0; // Initialize driver count
    let tripscount = 0;
    let revenue = 0;
    let pending = 0;

    // Loop through each document in the snapshot
    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Check if the user is a driver (assuming a 'driver' field)
      if (data ) { // Check for both driver field and its truthy value
        driverCount++;
        DriverData.push({ name: data.fullname,
          email: data.email,
          phone: data.phone,
          veh_model: data.vehicle_make_model,
         }); // Add name to user data object

        if (data.status === "Vehicle data added") {
          pending++;
        }
      }
    }

    for (const doc of tripSnapshot.docs) {
      const data2 = doc.data();

      // Check if the trip has a driver field (assuming data integrity)
      if (data2) {
        tripscount++;
        revenue += data2.Additional_fares + data2.Trip_fare;
      }
    }

    console.log(`Total Drivers: ${driverCount} , Trips: ${tripscount}`); // Log driver count to console

    res.send({
      success: true,
      data: {
        drivers: driverCount,
        trips: tripscount,
        revenue: revenue,
        pending: pending,
        Driverdata: DriverData, // Include allUserData with names
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getUserDetails };

