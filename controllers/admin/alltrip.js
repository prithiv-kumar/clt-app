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







