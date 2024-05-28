const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');

const updateUserDetails = async (req, res) => {
  try {
    const { rta_card_no,
      license_type,
      rta_vehicle_no,
      vehicle_make_model,
      vehicle_color, uid } = req.body;

    // Validate if all required fields are present
    if ( !rta_card_no 
      || !license_type
      || !rta_vehicle_no
      || !vehicle_make_model
      || !vehicle_color || !uid) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Check if the user with the provided UID exists
    const userSnapshot = await usersCollection.where('uid', '==', uid).get();
    if (userSnapshot.empty) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update user details
    const userDocRef = userSnapshot.docs[0].ref;
    await userDocRef.update({
      rta_card_no,
      license_type,
      rta_vehicle_no,
      vehicle_make_model,
      vehicle_color,
      status: 'Vehicle data added',
      validRtaCard : [],
      driverProfilePhoto : [],
      validEmiratesId : [],
      carPhoto1 : [],
      carPhoto2 : [],
      carPhoto3 : [],
      carPhoto4 : [],
      // validEmiratesPass : [],
      RtaRegVehicle: [],

      
      // Update other fields as needed
    });

    // Return success response
    return res.status(200).send({  success: true, message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = { updateUserDetails };
