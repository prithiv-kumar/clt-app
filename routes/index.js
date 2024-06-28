


// const register = require('../controllers/register/register.js');
// const upload = require('../controllers/upload/upload.js');
// const updatereg = require('../controllers/updatereg/updatereg.js');
// const customer_info = require('../controllers/customer_info/customer_info.js');
// const customer_update = require('../controllers/customer_info/customer_upd.js');
// const trip = require('../controllers/customer_info/trip.js');
// const user_details = require('../controllers/user_details/user_details.js');
// const postlive = require('../controllers/driver/postlive.js');
// const getlive = require('../controllers/driver/getlive.js');
// const tripfilter = require('../controllers/customer_info/tripfilter.js');
// const admin_post = require('../controllers/admin/adminpost.js');
// const alldriver = require('../controllers/admin/getdriver.js');
// const ebill = require('../controllers/admin/getbill.js');
// const getdriverrev = require('../controllers/admin/getdriverrev.js');
// const getloc = require('../controllers/admin/getloc.js');
// const poststatus = require('../controllers/upload/docstatus.js');
// const updatestatus = require('../controllers/upload/updatedstatus.js');
// const postfare = require('../controllers/customer_info/postfare.js');
// const getfare = require('../controllers/customer_info/getfare.js');
// const alltrip = require('../controllers/admin/alltrip.js');
// const getfilter = require('../controllers/admin/getfilter.js');
// // const deleted = require('../controllers/admin/delete.js');
// const getexcel = require('../controllers/admin/getreport.js');

// const cors = require('cors');

// // Define the allowed frontend origin
// const frontendOrigin = 'http://3.91.86.142:80'; // Replace with the actual frontend IP or domain

// // CORS options
// const corsOptions = {
//   origin: frontendOrigin,
//   optionsSuccessStatus: 200
// };

// // const admin_login = require('../controllers/admin/adminlog.js');
// module.exports = function(app) {

//     //driver registration
//     app.post('/register', register.register);
//     app.put('/updateregister', updatereg.updateUserDetails);
//     app.post('/upload', upload.uploadFiles);
//     app.post('/poststatus', poststatus.status);
//     app.put('/updatestatus', cors(corsOptions), updatestatus.updateStatus);

//     //customer data added and updated
//     app.post('/customerinfo', customer_info.customer_info);
//     app.put('/customerupdate', customer_update.updateCustomer);

//     //admin accnt creation
//     app.post('/adminpost', admin_post.register);
//     app.get('/getebills', cors(corsOptions), ebill.getbill);
//     app.get('/getexcel', cors(corsOptions), getexcel.generateExcel);
//     app.get('/getdriverrev', cors(corsOptions), getdriverrev.getdriverrev);
//     app.get('/getloc', cors(corsOptions), getloc.getloc);
//     app.get('/alltrip/:userId', alltrip.getalltrips);
//     app.get('/getfilter', getfilter.getfilter);

//     app.get('/trip/:userId', tripfilter.gettripfilter);
//     // app.get('/trip/:userId', trip.getTripDetails );
//     app.get('/userdetails/:userId', user_details.getUserDetails);

//     //admin
//     app.get('/drivers', cors(corsOptions), alldriver.getUserDetails);

//     app.post('/postlive', postlive.postlive);
//     app.get('/getlive/:userId', getlive.getlive);

//     app.post('/postfares', postfare.postfare);
//     app.get('/getfares', getfare.getfare);

//     // app.delete('/delete', deleted.deleteUsers);
// };


const register = require('../controllers/register/register.js');
const upload = require('../controllers/upload/upload.js');
const updatereg = require('../controllers/updatereg/updatereg.js');
const customer_info = require('../controllers/customer_info/customer_info.js');
const customer_update = require('../controllers/customer_info/customer_upd.js');
const trip = require('../controllers/customer_info/trip.js');
const user_details = require('../controllers/user_details/user_details.js');
const postlive = require('../controllers/driver/postlive.js');
const getlive = require('../controllers/driver/getlive.js');
const tripfilter = require('../controllers/customer_info/tripfilter.js');
const admin_post = require('../controllers/admin/adminpost.js');
const alldriver = require('../controllers/admin/getdriver.js');
const ebill = require('../controllers/admin/getbill.js');
const getdriverrev = require('../controllers/admin/getdriverrev.js');
const getloc = require('../controllers/admin/getloc.js');
const poststatus = require('../controllers/upload/docstatus.js');
const updatestatus = require('../controllers/upload/updatedstatus.js');
const postfare = require('../controllers/customer_info/postfare.js');
const getfare = require('../controllers/customer_info/getfare.js');
const alltrip = require('../controllers/admin/alltrip.js');
const getfilter = require('../controllers/admin/getfilter.js');
// const deleted = require('../controllers/admin/delete.js');
const getexcel = require('../controllers/admin/getreport.js');

const cors = require('cors');

// Define the allowed frontend origin
const frontendOrigin = 'http://3.91.86.142'; // Replace with the actual frontend IP or domain

// CORS options
const corsOptions = {
  origin: frontendOrigin,
  methods: ['GET', 'POST', 'PUT'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
};

// const admin_login = require('../controllers/admin/adminlog.js');
module.exports = function(app) {

    //driver registration
    app.post('/register', register.register);
    app.put('/updateregister', updatereg.updateUserDetails);
    app.post('/upload', upload.uploadFiles);
    app.post('/poststatus', poststatus.status);
    app.put('/updatestatus', cors(corsOptions), updatestatus.updateStatus);

    //customer data added and updated
    app.post('/customerinfo', customer_info.customer_info);
    app.put('/customerupdate', customer_update.updateCustomer);

    //admin accnt creation
    app.post('/adminpost', admin_post.register);
    app.get('/getebills', cors(corsOptions), ebill.getbill);
    app.get('/getexcel', cors(corsOptions), getexcel.generateExcel);
    app.get('/getdriverrev', cors(corsOptions), getdriverrev.getdriverrev);
    app.get('/getloc', cors(corsOptions), getloc.getloc);
    app.get('/alltrip/:userId', alltrip.getalltrips);
    app.get('/getfilter', getfilter.getfilter);

    app.get('/trip/:userId', tripfilter.gettripfilter);
    // app.get('/trip/:userId', trip.getTripDetails );
    app.get('/userdetails/:userId', user_details.getUserDetails);

    //admin
    app.get('/drivers', cors(corsOptions), alldriver.getUserDetails);

    app.post('/postlive', postlive.postlive);
    app.get('/getlive/:userId', getlive.getlive);

    app.post('/postfares', postfare.postfare);
    app.get('/getfares', getfare.getfare);

    // app.delete('/delete', deleted.deleteUsers);
};

