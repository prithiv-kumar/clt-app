const admin = require('firebase-admin');
const firestore = require('../../db'); 

const faresCollection = firestore.collection('farecal');

const postfare = async (req, res) => {
  try {
    const {model,daytime_base_fare, daytime_per_km_rate, nighttime_base_fare, nighttime_per_km_rate, peak_time_base_fare, peak_time_per_km_rate
    } = req.body;

    

    const userData = {
      model,
      daytime_base_fare,
      daytime_per_km_rate,
      nighttime_base_fare,
      nighttime_per_km_rate,
      peak_time_base_fare,
      peak_time_per_km_rate,
      
    };

    
    
    const userDocRef = await faresCollection.add(userData);

    res.send({
      success: true,
      message: 'User location posted. .',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'failed' });
  }
};

module.exports = { postfare };
