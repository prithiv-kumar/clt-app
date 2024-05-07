const admin = require('firebase-admin');
const firestore = require('../../db'); 

const usersCollection = firestore.collection('location');

const postlive = async (req, res) => {
  try {
    const { lattitude, longitude,uid } = req.body;

    

    const userData = {
      lattitude,
      longitude,
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

module.exports = { postlive };
