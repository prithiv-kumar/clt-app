    const express = require('express');
    const admin = require('firebase-admin');
    const routes = require('./routes/index.js');
    const multer = require('multer'); 
    // const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
    const db = require('./db');
    const app = express();
    require('dotenv').config();
    app.use(express.json()); 
    // app.use(express.urlencoded({ extended: true }));

    // Apply Multer middleware before the upload route
   



    // Use each route exported from the index.js file
    routes(app);
    
    // Route to check Firebase connection
    app.get('/check-firebase-connection', (req, res) => {
        try {
            // Access Firebase services
            const firestore = admin.firestore();
            const messaging = admin.messaging();

            // You can perform operations with Firestore or Messaging here
            // For example, you can fetch data from Firestore or send a test message using Messaging
            console.log(firestore);

            res.send('Connected to Firebase successfully!');
        } catch (error) {
            console.error('Error connecting to Firebase:', error);
            res.status(500).send('Failed to connect to Firebase');
        }
    });

  

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
