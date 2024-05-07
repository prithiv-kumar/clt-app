// const { loginWithEmailPassword } = require('../controllers/login/login.js'); // Assuming login.js is in a 'controllers' folder
// module.exports = app => {
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       const loginResult = await loginWithEmailPassword(email, password);
//       if (loginResult.success) {
//         // Handle successful login (e.g., send custom token to client)
//         res.send({ message: 'Login successful!', customToken: loginResult.customToken });
//       } else {
//         res.status(401).send({ message: loginResult.message }); // Unauthorized
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       res.status(500).send({ message: 'Internal server error' });
//     }
  
// });
// };