

// const PAGE_SIZE = 10; // Adjust this value to define the number of trips per page
// const admin = require('firebase-admin');
// const firestore = require('../../db'); // Assuming connection setup elsewhere
// const usersCollection = firestore.collection('users');
// const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

// const getdriverrev = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
//     const limit = PAGE_SIZE;
    
//     let driverQuery = usersCollection.orderBy('uid').limit(limit + 1); // Fetch drivers with an extra document for pagination

//     if (page > 1) {
//       const lastVisibleDoc = await usersCollection.orderBy('uid').limit((page - 1) * limit).get();
//       if (!lastVisibleDoc.empty) {
//         const lastDoc = lastVisibleDoc.docs[lastVisibleDoc.docs.length - 1];
//         driverQuery = driverQuery.startAfter(lastDoc); // Start after the last document of the previous page
//       }
//     }

//     const driverSnapshot = await driverQuery.get(); // Execute the query

//     if (driverSnapshot.empty) {
//       return res.send({ success: true, data: [], nextPage: false }); // No drivers found
//     }

//     const driverData = [];
//     let nextPage = false;

//     for (let i = 0; i < limit; i++) { // Process only limit documents (skipping the extra one)
//       const driverDoc = driverSnapshot.docs[i];
//       if (!driverDoc) break;

//       let trip = 0;
//       let revenue = 0;
//       let uid = "";
//       let fullname= "", email= ""; 
//       let veh_model="";
//       let phone= "";
//        const driver = driverDoc.data();
//       //  uid = driver.uid; // Get the UID from the driver document
//       //  fullname = driver.fullname;
//       //  email = driver.email;
//       //  veh_model = driver.vehicle_make_model;
//       //  phone = driver.phone;

//       uid = driver.uid || ""; // Use default empty string if uid is missing
//       fullname = driver.fullname || ""; // Use default empty string if fullname is missing
//       email = driver.email || ""; // Use default empty string if email is missing
//       veh_model = driver.vehicle_make_model || ""; // Use default empty string if vehicle_make_model is missing
//       phone = driver.phone || ""; // Use default empty string if phone is missing

//       const userSnapshot = await tripsCollection.where('uid', '==', uid).get(); // Fetch matching user data

//       if (!userSnapshot.empty) {
//         for (const tripDoc of userSnapshot.docs) {
//           const userData = tripDoc.data();
//           trip++; // Increment trip count
//           revenue += userData.Additional_fares + userData.Trip_fare; // Sum up the revenue
//         }
//       } else {
//         console.warn(`User with UID ${uid} not found in trips collection.`);
//       }

//       driverData.push({
//         email: email,
//         uid: uid,
//         fullname: fullname,
//         veh_model: veh_model,
//         phone: phone,
//         trips: trip,
//         revenue: revenue,
//         company: ""
//       });
//     }

//     // Determine if there is a next page
//     if (driverSnapshot.docs.length === limit + 1) {
//       nextPage = true;
//       driverData.pop(); // Remove the extra document used for pagination check
//     }

//     res.send({ success: true, data: driverData, nextPage: nextPage });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to fetch trip details' });
//   }
// };

// module.exports = { getdriverrev };


const PAGE_SIZE = 10; // Adjust this value to define the number of trips per page
const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere
const usersCollection = firestore.collection('users');
const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const getdriverrev = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;
    const fullnameQuery = req.query.fullname || ''; // Get the fullname from query parameter

    let driverQuery = usersCollection.orderBy('uid').limit(limit + 1); // Fetch drivers with an extra document for pagination

    if (fullnameQuery) {
      driverQuery = usersCollection.where('fullname', '==', fullnameQuery).limit(limit + 1); // Filter by fullname
    } else if (page > 1) {
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
      let uid = "";
      let fullname = "";
      let email = "";
      let veh_model = "";
      let phone = "";
      const driver = driverDoc.data();

      uid = driver.uid || ""; // Use default empty string if uid is missing
      fullname = driver.fullname || ""; // Use default empty string if fullname is missing
      email = driver.email || ""; // Use default empty string if email is missing
      veh_model = driver.vehicle_make_model || ""; // Use default empty string if vehicle_make_model is missing
      phone = driver.phone || ""; // Use default empty string if phone is missing

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
        uid: uid,
        fullname: fullname,
        veh_model: veh_model,
        phone: phone,
        trips: trip,
        revenue: revenue,
        company: ""
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
