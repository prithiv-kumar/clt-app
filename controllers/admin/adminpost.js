const admin = require('firebase-admin');
const firestore = require('../../db'); 
const auth = admin.auth(); // Add this line to access Authentication

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create user with email/password
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Set custom claim (`admin`) on the newly created user
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });

    res.status(200).send({
      success: true,
      message: 'User created successfully and assigned admin privileges!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create user' });
  }
};

module.exports = { register }; // Add register to exports
