// const admin = require('firebase-admin');

// const firestore = require('../../db'); // Assuming connection setup elsewhere

// const usersCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

// const gettripfilter = async (req, res) => {
//   try {
//     const userId = req.params.userId; // Assuming userId is passed in the URL parameters
//     const requestedDate = req.query.date; // Assuming date is passed in the URL query parameters

//     if (!requestedDate) {
//       return res.status(400).send({ message: 'Missing required parameter: date' });
//     }

//     const snapshot = await usersCollection
//       .where('uid', '==', userId)
//       .where('date', '==', requestedDate) // Filter by date
//       .get();


//       let userData = [];
//     if (snapshot.empty) {
//       return res.send({ success: true,data: userData, });
//     }

//     // let userData = [];

//     snapshot.forEach(doc => {
//       const data = doc.data();
//       userData.push(data);
//     });

//     res.send({
//       success: true,
//       data: userData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to fetch trip details' });
//   }
// };

// module.exports = { gettripfilter };


const admin = require('firebase-admin');
const moment = require('moment'); // Assuming moment.js is installed
require('moment-timezone');
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const gettripfilter = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the URL parameters
    const requestedDate = req.query.date; // Assuming date is passed in the URL query parameters
     
    let userData = [];
      // Get the current date in Dubai
      const dubaiTime = moment().tz("Asia/Dubai");
      const currentDubaiDate = dubaiTime.format("YYYY-MM-DD"); // Adjust the format as needed
      console.log("Dubai Date:", currentDubaiDate);



      const snapshot0 = await usersCollection
      .where('uid', '==', userId)
      .where('date', '==', currentDubaiDate) // Filter by date
      .get();

      let revenue = 0;

    if (snapshot0.empty) {
      revenue;
    }


     

      if (!snapshot0.empty) {
        for (const tripDoc of snapshot0.docs) {
          const userData0 = tripDoc.data();
     
          revenue += userData0.Additional_fares + userData0.Trip_fare; // Sum up the revenue
        }
      } else {
        console.warn(`User with UID not found in trips collection.`);
      }

      // const todayrev = revenue.toFixed(2); // Convert to string with two decimal places
       // Calculate todayrev with two decimal places using Math.round and scaling
    const revenueInCents = Math.round((revenue * 100)); // Multiply by 100 to convert to cents
    const todayrev = revenueInCents / 100; // Divide back to get revenue with two decimal places



    if (!requestedDate) {
      return res.status(400).send({ message: 'Missing required parameter: date' });
    }

    const snapshot = await usersCollection
      .where('uid', '==', userId)
      .where('date', '==', requestedDate) // Filter by date
      .get();


    
    if (snapshot.empty) {
      return res.send({ success: true,data: userData, todayrev: todayrev});
    }

    // let userData = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      userData.push(data);
    });

    res.send({
      success: true,
      data: userData,
      todayrev: todayrev,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { gettripfilter };