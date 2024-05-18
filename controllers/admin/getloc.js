const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('location');

const getloc = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();

    if (snapshot.empty) {
      return res.send({ success: true, data: [] }); // No documents found
    }

    const allUserData = [];

    snapshot.forEach(doc => {
      allUserData.push(doc.data());
    });

    res.send({
      success: true,
      data: allUserData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getloc };
