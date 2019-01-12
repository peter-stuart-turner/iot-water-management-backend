const router = require('express').Router();

/*
* Demo API
*/
router.use('/demo', require('./demo'));

/*
* Systems API
*/
router.use('/system', require('./systems'));

/*
* Users API
*/
router.use('/user', require('./users'));

/*
* Scheduler API
*/
router.use('/scheduler', require('./scheduler'));


// router.get('/publish', function(req, res, next) {
//   mqtt_publish(MQTT_CLIENT, 'test3', 'Hello');
// });
//
// router.get('/subscribe', function(req, res, next) {
//   mqtt_subscribe(MQTT_CLIENT, 'test1', (result) => {
//   });
// });

router.all('*', function(req, res, next) {
  return res.status(404).send(INVALID_REQUEST).end();
});



module.exports = router;
