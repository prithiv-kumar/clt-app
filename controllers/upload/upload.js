

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere

// Get a reference to Firebase Storage
const storage = admin.storage();

// Init Multer upload for two files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit per file
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'validRtaCard', maxCount: 1 },
  { name: 'driverProfilePhoto', maxCount: 1 },
  { name: 'validEmiratesId', maxCount: 1 },
  { name: 'carPhoto1', maxCount: 1 },
  { name: 'carPhoto2', maxCount: 1 },
  { name: 'carPhoto3', maxCount: 1 },
  { name: 'carPhoto4', maxCount: 1 },
  { name: 'validEmiratesPass', maxCount: 1 },
  { name: 'RtaRegVehicle', maxCount: 1 },
]);

// Check file type
function checkFileType(file, cb) {
  const filetypes = /pdf|jpeg|jpg/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDF and JPEG files only!');
  }
}

async function uploadFiles(req, res) {
  try {
    // Execute multer upload
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ success: false, message: err });
      }

      const uid = req.body.uid; // Assuming UID is passed in the request body

      const uploadPromises = [];

      // Loop through uploaded files
      for (const key of Object.keys(req.files)) {
        const file = req.files[key][0];

        // Generate a unique filename for each file
        const fileName = uuidv4() + (file.mimetype === 'application/pdf' ? '.pdf' : '.jpeg');

        // Get a reference to the file in storage
        const fileRef = storage.bucket().file(fileName);

        // Upload file to Firebase Storage
        uploadPromises.push(fileRef.save(file.buffer));

        // Get the download URL after upload and use it for both console logging and storing in Firestore
        const downloadURL = await fileRef.getSignedUrl({ action: 'read', expires: '01-01-2100' });
        console.log(`Download URL for ${fileName}: ${downloadURL}`);
        
        uploadPromises.push(downloadURL);
      }

      // Wait for all uploads and download URL retrievals to complete
      const downloadURLs = await Promise.all(uploadPromises);
      console.log(downloadURLs);
      
      // Now you can update user details based on the uploaded files
      const usersCollection = firestore.collection('users'); // Assuming you have a collection named 'users'

      // Check if the user with the provided UID exists
      const userSnapshot = await usersCollection.where('uid', '==', uid).get();
      if (userSnapshot.empty) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user details
      const userDocRef = userSnapshot.docs[0].ref;
      const userData = {};

      
const validDownloadURLs = downloadURLs.filter(url => url !== undefined);

// Assign download URLs to userData based on their index
        validDownloadURLs.forEach((url, index) => {
          if (index === 0) {
            userData.validRtaCard = url;
          } else if (index === 1) {
            userData.driverProfilePhoto = url;
          } else if (index === 2) {
            userData.validEmiratesId = url;
          }
            else if (index === 3) {
              userData.carPhoto1 = url;
            }
            else if (index === 4) {
              userData.carPhoto2 = url;
            }
            else if (index === 5) {
              userData.carPhoto3 = url;
            }
            else if (index === 6) {
              userData.carPhoto4 = url;
            } else if (index === 7) {
              userData.validEmiratesPass = url;
            } else if (index === 8) {
              userData.RtaRegVehicle = url;
            }
        });


        // Update user status if there are valid download URLs
          if (validDownloadURLs.length > 0) {
            userData.status = "approved";
          }
          
      // Update user details only if there are valid download URLs to update
      if (Object.keys(userData).length > 0) {
        await userDocRef.update(userData);
      }
      console.log(userData);
      // Update user details only if there are valid download URLs to update
      


      // Return success response
      return res.status(200).json({ success: true, message: 'User details updated successfully' });
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  uploadFiles: uploadFiles
};

