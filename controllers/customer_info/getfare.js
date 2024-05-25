


// const admin = require('firebase-admin');
// const firestore = require('../../db'); // Assuming connection setup elsewhere

// const usersCollection = firestore.collection('farecal');

// const moment = require('moment'); // Assuming moment.js is installed
// require('moment-timezone');

// const getfare = async (req, res) => {
//   try {
//     const { model, rideTime, distance } = req.query;

//     if (!model || !rideTime || !distance) {
//       return res.status(400).send({ message: 'Model, ride time, and distance are required.' });
//     }

//     const dubaiTime = moment().tz("Asia/Dubai");
//     const currenttime = dubaiTime.format("HH:mm:ss");
//     console.log("Dubai Time:", currenttime);

//     let timeClassification;

//     const currentHour = dubaiTime.hour();

//     if ((currentHour >= 6 && currentHour < 10) || (currentHour >= 15 && currentHour < 19)) {
//       timeClassification = 'peak time';
//     } else if (currentHour >= 5 && currentHour < 13) {
//       timeClassification = 'morning time';
//     } else if (currentHour >= 13 && currentHour < 24) {
//       timeClassification = 'night time';
//     } else {
//       timeClassification = 'other time';
//     }

//     let Basefare = 0;
//     let costpkm = 0;
    
//     const querySnapshot = await usersCollection.where('model', '==', model).get();
//     if (!querySnapshot.empty) {
//       querySnapshot.forEach(doc => {
//         const data = doc.data();
//         console.log('Document data:', data);    
//         if(timeClassification === 'peak time'){
//             Basefare = data.peak_time_base_fare;
//             costpkm = data.peak_time_per_km_rate;
            
//         }else if(timeClassification === 'morning time'){
//             Basefare = data.daytime_base_fare;
//             costpkm = data.daytime_per_km_rate;
//         }else if(timeClassification === 'night time'){
//             Basefare = data.nighttime_base_fare;
//             costpkm = data.nighttime_per_km_rate;
//         }   
//       });
//     } else {
//       console.log('No matching documents found.');
//     }
//     console.log('Basefare:', Basefare);
//     console.log('Cost per km:', costpkm);
//     console.log('Ride time:', rideTime);
//     console.log('Distance:', distance);
    
//     const Totalfare = Basefare + ((0.8 * rideTime) + (costpkm * distance));

//     res.send({
//       success: true,
//       timeClassification: timeClassification,
//       currentTime: currenttime,
//       data: data,
//       Totalfare: Totalfare
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to fetch user details' });
//   }
// };

// module.exports = { getfare };


const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('farecal');

const moment = require('moment'); // Assuming moment.js is installed
require('moment-timezone');

const getfare = async (req, res) => {
  try {
    const { model, rideTime, distance } = req.query;

    if (!model || !rideTime || !distance) {
      return res.status(400).send({ message: 'Model, ride time, and distance are required.' });
    }

    const dubaiTime = moment().tz("Asia/Dubai");
    const currenttime = dubaiTime.format("HH:mm:ss");
    console.log("Dubai Time:", currenttime);

    let timeClassification;

    const currentHour = 20

    if ((currentHour >= 6 && currentHour < 10) || (currentHour >= 15 && currentHour < 19)) {
      timeClassification = 'peak time';
    } else if (currentHour >= 5 && currentHour < 13) {
      timeClassification = 'morning time';
    } else if (currentHour >= 13 && currentHour < 24) {
      timeClassification = 'night time';
    } else {
      timeClassification = 'other time';
    }

    let Basefare = 0;
    let costpkm = 0;
    let matchingModelFound = false;
    console.log('Model:', model);

    const querySnapshot = await usersCollection.get();
    querySnapshot.forEach(doc => {
      const data = doc.data();
    //   console.log('Document data:', data);
      if (data.model == model) { // Check if model value in document matches query model
        matchingModelFound = true;
        console.log('Matching document data:', data);    
        if (timeClassification === 'peak time') {
          Basefare = data.peak_time_base_fare;
          costpkm = data.peak_time_per_km_rate;
        } else if (timeClassification === 'morning time') {
          Basefare = data.daytime_base_fare;
          costpkm = data.daytime_per_km_rate;
        } else if (timeClassification === 'night time') {
          Basefare = data.nighttime_base_fare;
          costpkm = data.nighttime_per_km_rate;
        }   
      }
    });

    if (!matchingModelFound) {
      console.log('No matching model found.');
      return res.status(404).send({ message: 'No matching model found.' });
    }

    const Totalfare = Basefare + ((0.8 * rideTime) + (costpkm * distance));

    res.send({
      success: true,
      timeClassification: timeClassification,
      currentTime: currenttime,
      Totalfare: Totalfare
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getfare };
