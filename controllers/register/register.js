const admin = require('firebase-admin');
const firestore = require('../../db'); 

const usersCollection = firestore.collection('users');

const register = async (req, res) => {
  try {
    const { fullname, email, phone,uid } = req.body;

    

    const userData = {
      fullname,
      email,
      phone,
      uid,
      verified: true,
      status: 'Initial data added',
      rta_card_no : "",
      license_type : "",
      rta_vehicle_no : "",
      vehicle_make_model : "",
      vehicle_color : "",
      validRtaCard : [],
      driverProfilePhoto : [],
      validEmiratesId : [],
      carPhoto1 : [],
      carPhoto2 : [],
      carPhoto3 : [],
      carPhoto4 : [],
      validEmiratesPass : [],
      RtaRegVehicle: [],
    };

    
    
    const userDocRef = await usersCollection.add(userData);

    res.send({
      success: true,
      message: 'User details added. .',
    });
  } catch (error) {
    console.error(error);
    // res.status(500).send({ message: 'failed' });
    res.send({
      success: false,
      message: 'User details added. .',
    });

  }
};

module.exports = { register };
