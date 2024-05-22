const admin = require('firebase-admin');
const firestore = require('../../db'); 

const usersCollection = firestore.collection('docstatus');

const status = async (req, res) => {
  try {
    // const { uid } = req.body;
    const uid = req.query.uid;

    

    const userData = {
        
            validRtaCard_status: "waiting",
            driverProfilePhoto_status: "waiting",
            validEmiratesId_status: "waiting",
            carPhoto1_status: "waiting",
            carPhoto2_status: "waiting",
            carPhoto3_status: "waiting",
            carPhoto4_status: "waiting",
            validEmiratesPass_status: "waiting",
            RtaRegVehicle_status: "waiting",
            uid
    };

    
    
    const userDocRef = await usersCollection.add(userData);

    res.send({
      success: true,
      message: 'User location posted. .',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'failed' });
  }
};

module.exports = { status };
