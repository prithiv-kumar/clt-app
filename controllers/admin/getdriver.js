const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');
const trips = firestore.collection('customers');

const getUserDetails = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const tripSnapshot = await trips.get();
    // Create an empty array to store user data
    let allUserData = [];
    let driverCount = 0; // Initialize driver count
    let tripscount = 0;
    let revenue = 0;
    let pending = 0;
    // Loop through each document in the snapshot
    for (const doc of snapshot.docs) {
      const data = doc.data();
    //   allUserData.push(data);

      // Check if the user is a driver (assuming a 'driver' field)
      if (data) {
        driverCount++;
      
      if(data.status === "Vehicle data added")
        pending++;
      }
    }

    for (const doc of tripSnapshot.docs) {
        const data2 = doc.data();
        // allUserData.push(data2);
  
        // Check if the user is a driver (assuming a 'driver' field)
        if (data2) {
          tripscount++;
          revenue += data2.Additional_fares + data2.Trip_fare;
          

        }
      }
  

    // if (allUserData.length === 0) {
    //   return res.status(404).send({ message: 'No users found' });
    // }

    console.log(`Total Drivers: ${driverCount} , Trips: ${tripscount}`,); // Log driver count to console

    res.send({
        success: true,
        data: {
          drivers: driverCount,
          trips: tripscount,
          revenue: revenue,
          pending: pending,
        },
      });
      
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getUserDetails };
