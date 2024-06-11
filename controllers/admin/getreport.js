const admin = require('firebase-admin'); // Require the Firebase Admin SDK
const firestore = require('../../db'); // Assuming connection setup elsewhere
const xlsx = require('xlsx'); // Require xlsx for creating Excel files
const { v4: uuidv4 } = require('uuid'); // Require uuid for generating unique file names
const os = require('os'); // Require os module to get the temp directory
const path = require('path'); // Require path module to handle file paths

const usersCollection = firestore.collection('users');
const tripsCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const generateExcel = async (req, res) => {
  try {
    const nameQuery = req.query.name || ''; // Get the name from query parameter
    const dateQuery = req.query.date || ''; // Get the date from query parameter
    const fullnameQuery = req.query.fullname || ''; // Get the fullname from query parameter

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
    for (const doc of allTripsSnapshot.docs) {
      const trip = doc.data();
      const uid = trip.uid;
      const fname = trip.name;
      const email = trip.email;
      const date = trip.date;
      const tariff = trip.Trip_fare + trip.Additional_fares;
      const distance = trip.distance;
      const billno = trip.billNumber;

      const userSnapshot = await usersCollection.where('uid', '==', uid).get(); // Fetch matching user data
      let fullname = '';
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        fullname = userData.fullname; // Assuming 'fullname' field in users
      }

      allTripData.push({
        driver: fullname,
        customer: fname,
        customer_email: email,
        date: date,
        tariff: tariff,
        distance: distance,
        billNumber: billno,
      });
    }

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
      reportUrl: url, // Include the shareable link in the response
    });
  } catch (error) {
    if (error.code === 9 && error.details && error.details.includes('The query requires an index')) {
      console.error('Firestore query requires an index. Create it here:', error.details);
      res.status(500).send({ message: 'Firestore query requires an index. Create it using the provided link in the error details.' });
    } else {
      console.error(error);
      res.status(500).send({ message: 'Failed to generate Excel report' });
    }
  }
};

module.exports = { generateExcel };
