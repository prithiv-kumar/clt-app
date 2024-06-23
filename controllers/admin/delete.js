const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('location');

const deleteUsers = async (req, res) => {
  try {
    const exemptUids = ["v0jyttaeEdTiRdoo2epwvtoRs9F3", "WB9VidSYuOUutpWDIV2eoKFivP02"];

    const snapshot = await usersCollection.get();

    const batch = firestore.batch();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!exemptUids.includes(data.uid)) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();

    res.send({
      success: true,
      message: 'Non-exempt users deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete users' });
  }
};

module.exports = { deleteUsers };
