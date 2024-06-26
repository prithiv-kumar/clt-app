



const admin = require('firebase-admin');

const firestore = require('../../db'); // Assuming connection setup elsewhere
const moment = require('moment'); // Assuming moment.js is installed
require('moment-timezone');
const customersCollection = firestore.collection('customers');
const usersCollection = firestore.collection('users');


const updateCustomer = async (req, res) => {
  try {
    const { Trip_fare, Additional_fares, Payment_method, Travel_distance, uid } = req.body;

    const dubaiTime = moment().tz("Asia/Dubai");
    const dubaiTimeFormatted = dubaiTime.format("HH:mm:ss");

    console.log("Dubai Time:", dubaiTimeFormatted);

    // Check user and trip status
    const userSnapshot = await customersCollection.where('uid', '==', uid)
      .where('status', '==', 'trip active')
      .get();
    if (userSnapshot.empty) {
      return res.status(404).send({ message: 'User not found or trip not active' });
    }
    let newBillNumber;
    
    const billCounterRef = firestore.collection('billCounter').doc('counter');
    
    // Perform transaction to ensure atomic update
    await firestore.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(billCounterRef);
       newBillNumber = counterDoc.data().billNumber + 1; // Get current number and increment

      transaction.update(billCounterRef, { billNumber: newBillNumber }); // Update counter

      // Update user details with incremented bill number
      const userDocRef = userSnapshot.docs[0].ref;

        // // Parse Additional_fares to a double (assuming it's a string)
        // const additionalFaresDouble = parseFloat(Additional_fares);

        // Calculate total fare if needed (assuming Trip_fare is also a string)
        // const totalFareDouble = parseFloat(Trip_fare);

      await transaction.update(userDocRef, {
        Trip_fare,
        Additional_fares,
        Payment_method,
        Travel_distance,
        dest_time: dubaiTimeFormatted,
        status: 'trip completed',
        billNumber: newBillNumber,
      });
    });

    // Update users collection (same as before)
      
        const userQuerySnapshot = await usersCollection.where('uid', '==', uid).get();
        if (!userQuerySnapshot.empty) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          await userDocRef.update({ status: 'approved' });
        } else {
          console.error('User not found with uid:', uid);
          return res.status(404).send({ message: 'User not found' });
        }
    // Return success response with bill number
    return res.status(200).send({
      success: true,
      billNumber: newBillNumber,
      message: 'User details and customer updated successfully',
      
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = { updateCustomer };