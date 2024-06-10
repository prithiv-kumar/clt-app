const admin = require('firebase-admin'); // Require the Firebase Admin SDK
const firestore = require('../../db'); // Assuming connection setup elsewhere
const xlsx = require('xlsx'); // Require xlsx for creating Excel files
const { v4: uuidv4 } = require('uuid'); // Require uuid for generating unique file names
const os = require('os'); // Require os module to get the temp directory
const path = require('path'); // Require path module to handle file paths

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

    // Collect all data for the Excel file
    let allTripsQuery = tripsCollection;
    if (fullnameQuery) {
      const userSnapshot = await usersCollection.where('fullname', '==', fullnameQuery).get();
      if (!userSnapshot.empty) {
        const uids = userSnapshot.docs.map(doc => doc.data().uid);
        allTripsQuery = allTripsQuery.where('uid', 'in', uids);
      }
    }
    if (nameQuery) {
      allTripsQuery = allTripsQuery.where('name', '==', nameQuery);
    }
    if (dateQuery) {
      allTripsQuery = allTripsQuery.where('date', '==', dateQuery);
    }
    allTripsQuery = allTripsQuery.orderBy('date');
    const allTripsSnapshot = await allTripsQuery.get();

    const allTripData = [];
    allTripsSnapshot.forEach(doc => {
      const trip = doc.data();
      const uid = trip.uid;
      const fname = trip.name;
      const email = trip.email;
      const date = trip.date;
      const tariff = trip.Trip_fare + trip.Additional_fares;
      const distance = trip.distance;
      const billno = trip.billNumber;

      allTripData.push({
        driver: trip.fullname || '', // Assuming trip data has the driver's fullname directly
        customer: fname,
        customer_email: email,
        date: date,
        tariff: tariff,
        distance: distance,
        billNumber: billno,
      });
    });

    // Create Excel file with all trip data
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(allTripData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Trips');

    // Generate unique file name and path
    const fileName = `trip-report-${uuidv4()}.xlsx`;
    const tempDir = os.tmpdir(); // Get the OS temporary directory
    const filePath = path.join(tempDir, fileName); // Temporary file path

    // Write workbook to file
    xlsx.writeFile(workbook, filePath);

    // Upload file to Firebase Storage
    const bucket = admin.storage().bucket();
    await bucket.upload(filePath, {
      destination: fileName,
      metadata: {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    // Generate shareable link
    const file = bucket.file(fileName);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Set a long expiration date
    });

    res.send({
      success: true,
      data: tripData,
      nextPage,
      reportUrl: url, // Include the shareable link in the response
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
