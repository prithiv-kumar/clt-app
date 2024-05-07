const admin = require('firebase-admin');

// Function to authenticate user with email and password and generate a custom token
async function loginWithEmailPassword(email, password) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    // Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    console.log("Custom token generated for user:", userRecord.email);
    return { success: true, customToken };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Error logging in: " + error.message };
  }
}

module.exports = {
  loginWithEmailPassword,
};
