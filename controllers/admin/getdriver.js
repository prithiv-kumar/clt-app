


// const PAGE_SIZE = 10; // Adjust this value to define the number of drivers per page

// const admin = require('firebase-admin');
// const firestore = require('../../db'); // Assuming connection setup elsewhere

// const usersCollection = firestore.collection('users');
// const trips = firestore.collection('customers');

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
//         nextPage: nextPage ? page + 1 : false, // Indicate if there is a next page
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to fetch user details' });
//   }
// };

// module.exports = { getUserDetails };


const PAGE_SIZE = 10; // Adjust this value to define the number of drivers per page

const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');
const trips = firestore.collection('customers');

const getUserDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;

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
      if (data) { // Check for both driver field and its truthy value
        driverCount++;
        DriverData.push({
          name: data.fullname,
          uid: data.uid,
          email: data.email,
          phone: data.phone,
          veh_model: data.vehicle_make_model,
        }); // Add name to user data object

        if (data.status === "Vehicle data added") {
          pending++;
        }
      }
    }

    // Implement pagination
    const totalDrivers = DriverData.length;
    const paginatedDrivers = DriverData.slice((page - 1) * limit, page * limit);
    const nextPage = page * limit < totalDrivers;
    
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
        Driverdata: paginatedDrivers, // Include paginated DriverData
        nextPage: nextPage, // Indicate if there is a next page with a boolean value
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getUserDetails };
