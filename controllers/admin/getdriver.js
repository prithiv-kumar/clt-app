const PAGE_SIZE = 10; // Adjust this value to define the number of drivers per page

const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');
const trips = firestore.collection('customers');
const statusCollection = firestore.collection('docstatus'); // Assuming 'docstatus' collection stores document status data

const getUserDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;
    const statusQuery = req.query.status || ''; // Get the status from query parameter

    let driverUIDs = [];

    // If statusQuery is 'onhold', fetch UIDs from docstatus collection
    if (statusQuery === 'onhold') {
      const statusSnapshot = await statusCollection.get();
      statusSnapshot.forEach(doc => {
        const data = doc.data();
        for (const key in data) {
          if (key.endsWith('_status') && data[key] === 'onhold') {
            driverUIDs.push(data.uid);
            break;
          }
        }
      });
    } else if (statusQuery === 'rejected') {
      const statusSnapshot = await statusCollection.get();
      statusSnapshot.forEach(doc => {
        const data = doc.data();
        for (const key in data) {
          if (key.endsWith('_status') && data[key] === 'rejected') {
            driverUIDs.push(data.uid);
            break;
          }
        }
      });
    }

    const snapshot = await usersCollection.get();
    const tripSnapshot = await trips.get();
    const statusSnapshot = await statusCollection.get(); // Fetch status collection

    // Create an empty array to store user data with name
    let DriverData = [];
    let driverCount = 0; // Initialize driver count
    let tripscount = 0;
    let revenue = 0;
    let pending = 0;

    // Create a map to store success count for each driver UID
    let successCountMap = {};

    // Process the status collection to count success statuses for each driver UID
    statusSnapshot.forEach(doc => {
      const data = doc.data();
      const uid = data.uid;

      if (!successCountMap[uid]) {
        successCountMap[uid] = 0;
      }

      for (const key in data) {
        if (key.endsWith('_status') && data[key] === 'success') {
          successCountMap[uid]++;
        }
      }
    });

    // Loop through each document in the snapshot
    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Check if the user data matches the status and other filters
      if (data) {
        if (statusQuery === 'onhold' || statusQuery === 'rejected') {
          // If filtering by onhold or rejected status, check if the UID is in the driverUIDs array
          if (driverUIDs.includes(data.uid)) {
            driverCount++;
            DriverData.push({
              name: data.fullname,
              uid: data.uid,
              email: data.email,
              phone: data.phone,
              veh_model: data.vehicle_make_model,
              status: data.status, // Include status in response data
              ver_status: successCountMap[data.uid] || 0, // Include success count
            });
          }
        } else {
          // Apply status filter if provided
          if (!statusQuery || data.status === statusQuery) {
            driverCount++;
            DriverData.push({
              name: data.fullname,
              uid: data.uid,
              email: data.email,
              phone: data.phone,
              veh_model: data.vehicle_make_model,
              status: data.status, // Include status in response data
              ver_status: successCountMap[data.uid] || 0, // Include success count
            });

            if (data.status === "Vehicle data added") {
              pending++;
            }
          }
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
