const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('customers'); // Assuming 'customers' collection stores trip data

const PAGE_SIZE = 10; // Adjust this value to define the number of trips per page

const getalltrips = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the URL parameters

    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default 1)
    const limit = PAGE_SIZE;

    let query = usersCollection.where('uid', '==', userId).orderBy('date').limit(limit);

    if (page > 1) {
      const previousSnapshot = await usersCollection
        .where('uid', '==', userId)
        .orderBy('date')
        .limit(limit * (page - 1)) // Fetch documents for previous pages
        .get();

      if (!previousSnapshot.empty) {
        const lastVisibleDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1];
        query = query.startAfter(lastVisibleDoc);
      }
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.send({ success: true, data: [], nextPage: false });
    }

    let userData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      userData.push(data);
    });

    const nextPage = snapshot.size === limit;

    res.send({
      success: true,
      data: userData,
      nextPage: nextPage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch trip details' });
  }
};

module.exports = { getalltrips };
