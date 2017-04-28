var mongoose = require('mongoose');
var db = require('../models/db.js');
var gcm = require('node-gcm');
// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
var sender = new gcm.Sender('AAAAXd306w8:APA91bHHZ2c3BLRPvo-IZGm3sjMNGkfk1_Syy0A3BzPCZs7PkaFPRMHHBRo_Db6Sr9_wf7wXJhi1sgDWg4Mivg6Mn6nnUGD5FiyU4omeH1NgjxzLw18liPB5FZaC2U-z_lpBqyteRBUx');

var Device = mongoose.model('Device');

//Register Device
module.exports.registerDevice = function(req, res) {
  console.log("In Register device");
  //Get values from body sent within request
  var deviceId = req.body.deviceId;

  //Registering device id for FCM
  var newDevice = new Device();
  newDevice.registrationId = deviceId;

  //saving data to mongodb
  newDevice.save(function(err, deviceId) {
    if(err) {
      var message = "Error in device registration";
			console.log(message);
      res.status(500).send({'statusMessage' : 'error', 'message' : message});
		} else {
			var message = "Device registration succssful";
      res.status(201).send({'statusMessage' : 'success', 'message' : message});
		}
  });
}

module.exports.notify = function(req, res) {
  var eventName = req.body.eventName;
  var about = req.body.about;
  var time = req.body.time;
  var date = req.body.date;

  Device.find({}, 'registrationId -_id', function(err, deviceIds) {
    if (err) {
      res.status(500).send('Error');
    }
    if (deviceIds != null && deviceIds.length > 0) {
      fcm(deviceIds, eventName, about, time, date);
      res.status(201).send('Success');
    } else {
      res.status(500).send('Error');
    }
  });
}

//FCM method
var fcm = function(deviceIds, eventName, about, time, date) {
  // Prepare a message to be sent
  var message = new gcm.Message({
      data: { title : eventName, detail : about, time : time, date : date }
  });
  // Specify which registration IDs to deliver the message to
  var regTokens = [];
  for (var i = 0; i < deviceIds.length; i++) {
    var device = deviceIds[i];
    regTokens.push(device.registrationId);
  }
  console.log("deviceIds",regTokens);

  // Actually send the message
  sender.send(message, { registrationTokens: regTokens }, function (err, response) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Response",response);
      }
  });
}
