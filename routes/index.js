
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
const admin_login = require('../controllers/admin/adminlog.js');
module.exports = function(app) {
  
    app.post('/register', register.register);
    app.put('/updateregister', updatereg.updateUserDetails);
    app.post('/upload', upload.uploadFiles);

    app.post('/customerinfo', customer_info.customer_info);
    app.put('/customerupdate', customer_update.updateCustomer);

    app.post('/adminpost', admin_post.register);
    app.post('/adminlogin', admin_login.login);
    
    app.get('/trip/:userId', tripfilter.gettripfilter);
    app.get('/trip/:userId', trip.getTripDetails );
    app.get('/userdetails/:userId', user_details.getUserDetails)

    app.post('/postlive', postlive.postlive)
    app.get('/getlive/:userId', getlive.getlive)
};
