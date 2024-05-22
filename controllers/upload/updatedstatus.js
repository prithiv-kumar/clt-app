// const admin = require('firebase-admin');
// const firestore = require('../../db');

// const usersCollection = firestore.collection('docstatus');

// const updateStatus = async (req, res) => {
//   try {
//     const { uid, ...statusUpdate } = req.body;

//     if (!uid) {
//       return res.status(400).send({ message: 'UID is required' });
//     }

//     const querySnapshot = await usersCollection.where('uid', '==', uid).get();

//     if (querySnapshot.empty) {
//       return res.status(404).send({ message: 'User document not found' });
//     }

//     const userDocRef = querySnapshot.docs[0].ref;

//     // Update the document with the provided status updates
//     await userDocRef.update(statusUpdate);

//     // Retrieve the updated document
//     const updatedDoc = await userDocRef.get();
//     const updatedData = updatedDoc.data();

//     // Check if all statuses are 'success'
//     const allStatusesSuccess = Object.keys(updatedData).every((key) => {
//       if (key.endsWith('_status')) {
//         return updatedData[key] === 'success';
//       }
//       return true;
//     });

//     if (allStatusesSuccess) {
//       return res.send({
//         success: true,
//         message: 'You are accepted',
//       });
//     } else {
//       return res.send({
//         success: true,
//         message: 'User document status updated.',
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to update document status' });
//   }
// };

// module.exports = { updateStatus };


const admin = require('firebase-admin');
const firestore = require('../../db');

const docstatusCollection = firestore.collection('docstatus');
const usersCollection = firestore.collection('users');

const updateStatus = async (req, res) => {
  try {
    const { uid, ...statusUpdate } = req.body;

    if (!uid) {
      return res.status(400).send({ message: 'UID is required' });
    }

    const querySnapshot = await docstatusCollection.where('uid', '==', uid).get();

    if (querySnapshot.empty) {
      return res.status(404).send({ message: 'User document not found in docstatus collection' });
    }

    const userDocRef = querySnapshot.docs[0].ref;

    // Update the document with the provided status updates
    await userDocRef.update(statusUpdate);

    // Retrieve the updated document
    const updatedDoc = await userDocRef.get();
    const updatedData = updatedDoc.data();

    // Check if all statuses are 'success'
    const allStatusesSuccess = Object.keys(updatedData).every((key) => {
      if (key.endsWith('_status')) {
        return updatedData[key] === 'success';
      }
      return true;
    });

    if (allStatusesSuccess) {
      // Find the user document in the users collection by uid and update its status to 'approved'
      const userQuerySnapshot = await usersCollection.where('uid', '==', uid).get();

      if (!userQuerySnapshot.empty) {
        const userRef = userQuerySnapshot.docs[0].ref;
        await userRef.update({ status: 'approved' });
      } else {
        return res.status(404).send({ message: 'User document not found in users collection' });
      }

      return res.send({
        success: true,
        message: 'All statuses are success. User status updated to approved.',
      });
    } else {
      return res.send({
        success: true,
        message: 'User document status updated.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update document status' });
  }
};

module.exports = { updateStatus };
