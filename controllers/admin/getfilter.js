


const admin = require('firebase-admin');
const firestore = require('../../db'); // Assuming connection setup elsewhere

const usersCollection = firestore.collection('users');
const trips = firestore.collection('customers');

const getfilter = async (req, res) => {
  try {
  

    const snapshot = await usersCollection.get();
    const tripSnapshot = await trips.get();

  

    const DriversSet = new Set();

    for (const doc of snapshot.docs) {
        const data1 = doc.data();
      
        // Check if the trip has a driver field (assuming data integrity)
        if (data1 && data1.fullname) {
            DriversSet.add(data1.fullname); // Add only unique customer names to the Set
        }
    }
    
    // Convert the Set to an array
    const Drivers = Array.from(DriversSet);



    const CustomersSet = new Set();

    for (const doc of tripSnapshot.docs) {
        const data2 = doc.data();
      
        // Check if the trip has a driver field (assuming data integrity)
        if (data2 && data2.name) {
            CustomersSet.add(data2.name); // Add only unique customer names to the Set
        }
    }
    
    // Convert the Set to an array
    const Customers = Array.from(CustomersSet);
    
    console.log(Customers);
    



   

    

    res.send({
      success: true,
      data: {
        Drivers: Drivers, // Include paginated DriverData
        Customers: Customers, // Include paginated DriverData
       
         // Indicate if there is a next page with a boolean value
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
};

module.exports = { getfilter };
