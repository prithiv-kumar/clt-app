const admin = require('firebase-admin');
// const PAGE_SIZE = 10; 
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const getalltrips = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    // const limit = PAGE_SIZE;
    const userId = req.params.userId; // Assuming userId is passed in the URL parameters
    // const requestedDate = req.query.date; // Assuming date is passed in the URL query parameters

    // if (!requestedDate) {
    //   return res.status(400).send({ message: 'Missing required parameter: date' });
    // }

    const snapshot = await usersCollection
      .where('uid', '==', userId)
    //   .where('date', '==', requestedDate) // Filter by date
      .get();


      let userData = [];
    if (snapshot.empty) {
      return res.send({ success: true,data: userData, });
    }

    // let userData = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      userData.push(data);
    });

    res.send({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { getalltrips };








// const getUserDetails = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
//     const limit = PAGE_SIZE;

//     const snapshot = await usersCollection.get();
//     const tripSnapshot = await trips.get();

//     // Create an empty array to store user data with name
//     let DriverData = [];
//     let driverCount = 0; // Initialize driver count
//     let tripscount = 0;
//     let revenue = 0;
//     let pending = 0;

//     // Loop through each document in the snapshot
//     for (const doc of snapshot.docs) {
//       const data = doc.data();

//       // Check if the user is a driver (assuming a 'driver' field)
//       if (data) { // Check for both driver field and its truthy value
//         driverCount++;
//         DriverData.push({
//           name: data.fullname,
//           uid: data.uid,
//           email: data.email,
//           phone: data.phone,
//           veh_model: data.vehicle_make_model,
//         }); // Add name to user data object

//         if (data.status === "Vehicle data added") {
//           pending++;
//         }
//       }
//     }

//     // Implement pagination
//     const totalDrivers = DriverData.length;
//     const paginatedDrivers = DriverData.slice((page - 1) * limit, page * limit);
//     const nextPage = page * limit < totalDrivers;
    
//     for (const doc of tripSnapshot.docs) {
//       const data2 = doc.data();

//       // Check if the trip has a driver field (assuming data integrity)
//       if (data2) {
//         tripscount++;
//         revenue += data2.Additional_fares + data2.Trip_fare;
//       }
//     }

//     console.log(`Total Drivers: ${driverCount} , Trips: ${tripscount}`); // Log driver count to console

//     res.send({
//       success: true,
//       data: {
//         drivers: driverCount,
//         trips: tripscount,
//         revenue: revenue,
//         pending: pending,
//         Driverdata: paginatedDrivers, // Include paginated DriverData
//         nextPage: nextPage, // Indicate if there is a next page with a boolean value
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to fetch user details' });
//   }
// };

// module.exports = { getUserDetails };
