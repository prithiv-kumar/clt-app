const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('customers');

const getTripDetails = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the URL parameters

    const snapshot = await usersCollection.where('uid', '==', userId).get();

    if (snapshot.empty) {
      return res.status(404).send({ message: 'User not found' });
    }

    let userData = [];
    
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
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getTripDetails };
