

const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere
const moment = require('moment'); // Assuming moment.js is installed
require('moment-timezone');
const usersCollection = firestore.collection('users');
const customersCollection = firestore.collection('customers');

const customer_info = async (req, res) => {
  try {
    const { name, email, phone, uid, company, curr_loc, curr_lat, curr_long, dest_loc, dest_lat, dest_long, base_fare, distance } = req.body;

    const dubaiTime = moment().tz("Asia/Dubai");
    const dubaiTimeFormatted = dubaiTime.format("HH:mm:ss");// Format as desired (e.g., "YYYY-MM-DD HH:mm:ss")
    const dubaidate = dubaiTime.format("YYYY-MM-DD");
    console.log("Dubai Time:", dubaiTimeFormatted);
    

      
    

    const userData = {
      name,
      email,
      phone,
      uid,
      company,
      curr_loc,
      curr_lat,
      curr_long,
      curr_time_dubai: dubaiTimeFormatted, // Dubai time representation
      date: dubaidate,
      dest_loc,
      dest_lat,
      dest_long,
      base_fare,
      distance,
      status: 'trip active',
    };
    // Add data to customers collection
    const customerDocRef = await customersCollection.add(userData);

    // Update data in users collection based on uid
    const userQuerySnapshot = await usersCollection.where('uid', '==', uid).get();
    if (!userQuerySnapshot.empty) {
      const userDocRef = userQuerySnapshot.docs[0].ref;
      await userDocRef.update({ status: 'trip active' });
    } else {
      console.error('User not found with uid:', uid);
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({
      success: true,
      message: 'Customer details added and user status updated.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to add customer details and update user status' });
  }
};

module.exports = { customer_info };
