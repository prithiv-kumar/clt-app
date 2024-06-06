
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
const cors = require('cors')
// const admin_login = require('../controllers/admin/adminlog.js');
module.exports = function(app) {
  
    //driver registration
    app.post('/register', register.register);
    app.put('/updateregister', updatereg.updateUserDetails);
    app.post('/upload', upload.uploadFiles);
    app.post('/poststatus', poststatus.status);
    app.put('/updatestatus',cors(), updatestatus.updateStatus);
    //customer data added and updated
    app.post('/customerinfo', customer_info.customer_info);
    app.put('/customerupdate', customer_update.updateCustomer);

    //admin accnt creation
    app.post('/adminpost', admin_post.register);
    app.get('/getebills', cors(), ebill.getbill);
    app.get('/getdriverrev', cors(), getdriverrev.getdriverrev);
    app.get('/getloc', cors(), getloc.getloc);
    app.get('/alltrip/:userId', alltrip.getalltrips);
    app.get('/getfilter', getfilter.getfilter);
    
    app.get('/trip/:userId', tripfilter.gettripfilter);
    // app.get('/trip/:userId', trip.getTripDetails );
    app.get('/userdetails/:userId', user_details.getUserDetails)

    //admin
    app.get('/drivers',cors(), alldriver.getUserDetails)

    app.post('/postlive', postlive.postlive)
    app.get('/getlive/:userId', getlive.getlive)

    app.post('/postfares', postfare.postfare)
    app.get('/getfares', getfare.getfare)
};
