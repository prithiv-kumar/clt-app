
const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the URL parameters

    const snapshot = await usersCollection.get();

    let userData = null;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.uid === userId) {
        userData = data;
        return;
      }
    });

    if (!userData) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getUserDetails };
