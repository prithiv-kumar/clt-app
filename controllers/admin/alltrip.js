const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

// const getalltrips = async (req, res) => {
//   try {
 
//     const userId = req.params.userId; // Assuming userId is passed in the URL parameters
  

//     const snapshot = await usersCollection
//       .where('uid', '==', userId)
  
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

const PAGE_SIZE = 10; // Adjust this value to define the number of trips per page

const getalltrips = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the URL parameters

    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;

    let lastVisibleDoc = null;
    if (page > 1) {
      const previousSnapshot = await usersCollection
        .where('uid', '==', userId)
        .limit(limit * (page - 1)) // Fetch documents for previous page
        .get();
      lastVisibleDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1];
    }

    const snapshot = await usersCollection
      .where('uid', '==', userId)
      .limit(limit) // Fetch limit documents
      .startAfter(lastVisibleDoc) // Start after last document from previous page (if any)
      .get();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { getalltrips };







