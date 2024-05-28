
const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');
const statusCollection = firestore.collection('docstatus');
const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the URL parameters

    const snapshot = await usersCollection.get();
    const statusSnapshot = await statusCollection.get();
    let userData = null;
    let userData2 = null;
    let mergedData = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.uid === userId) {
        userData = data;
        return;
      }
    });
    statusSnapshot.forEach(doc => {
      userData2 = doc.data();
      if (userData2.uid === userId){
        userData = { ...userData, ...userData2 };
      }
    });
    

    if (!userData) {
      return res.status(404).send({ message: 'User not found' });
    }
    // if (!userData2) {
    //   return res.status(404).send({ message: 'Data not found' });
    // }

    res.send({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getUserDetails };
