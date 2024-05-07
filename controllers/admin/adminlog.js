// const admin = require('firebase-admin');
// const firestore = require('../../db'); 
// const auth = admin.auth(); // Add this line to access Authentication
// // const { signInWithEmailAndPassword } = require('firebase/auth/admin');

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Sign in user with email/password
//     const user = await auth.signInWithEmailAndPassword(email, password);

//     // Check if user exists
//     if (!user) {
//       return res.status(401).send({ message: 'Invalid email or password' });
//     }

//     // Get user claims (including custom claims)
//     const claims = await auth.getUser(user.uid).then(userRecord => userRecord.claims);

//     // Check if user has the `admin` claim
//     const isAdmin = claims && claims.admin === true;

//     res.send({
//       success: true,
//       message: 'Login successful!',
//       isAdmin, // Include admin status in response
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Login failed' });
//   }
// };

// module.exports = { login }; // Update exports
