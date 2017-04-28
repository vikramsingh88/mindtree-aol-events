var mongoose = require('mongoose');
var db = require('../models/db.js');
var fs = require('fs');
var gcm = require('node-gcm');
// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
var sender = new gcm.Sender('AAAAXd306w8:APA91bHHZ2c3BLRPvo-IZGm3sjMNGkfk1_Syy0A3BzPCZs7PkaFPRMHHBRo_Db6Sr9_wf7wXJhi1sgDWg4Mivg6Mn6nnUGD5FiyU4omeH1NgjxzLw18liPB5FZaC2U-z_lpBqyteRBUx');

var Device = mongoose.model('Device');

var ComingSoon = mongoose.model('ComingSoon');

//create event
module.exports.createComingSoon = function(req, res) {
  var fullUrl = req.protocol + '://' + req.get('host');
  console.log("In Coming soon ",fullUrl);
  var eventBanner = req.body.banner;
  var eventName = req.body.eventName

  fs.writeFile('../server/public/images/event-banner/'+eventName+".png", eventBanner, 'base64', function(err) {
    if(err) {
      var message="Error in creating banner - "+err;
      console.log(message);
      res.status(500).send({'statusMessage' : 'error', 'message' : message});
    } else {
      var newBanner = new ComingSoon();
      newBanner.eventName = eventName;
      newBanner.eventBannerPath = fullUrl+"/images/event-banner/"+eventName+".png";
      newBanner.save(function(err, savedBannerPath) {
        if(err) {
          var message="Error in creating banner";
          console.log(message);
          res.status(500).send({'statusMessage' : 'error', 'message' : message});
        } else {
          var message="A new event banner created";
          Device.find({}, 'registrationId -_id', function(err, deviceIds) {
            if (err) {
              res.status(500).send('Error');
            }
            if (deviceIds != null && deviceIds.length > 0) {
              fcm(deviceIds, savedBannerPath.eventBannerPath, savedBannerPath.eventName);
              res.status(200).send({'statusMessage' : 'success', 'message' : message,'path' : savedBannerPath.eventBannerPath});
            } else {
              res.status(500).send('Error');
            }
          });
        }
      });
    }
  });
}

//Get coming soon by name
module.exports.getComingSoon = function(req, res) {
  var eventName = req.params.eventName;
  ComingSoon.findOne({"eventName" : eventName}, function(err, event) {
    if (err) {
      res.status(500).send({'statusMessage' : 'error', 'message' : 'Internal server error'});
    }
    if (event != null) {
      console.log('Buffer', event.eventBanner.data);
      res.status(200).send({'statusMessage' : 'success', 'message' : 'Events data available under event attributes','event' : event});
    } else {
      res.status(200).send({'statusMessage' : 'error', 'message' : 'No event data available'});
    }
  });
}

//FCM method
var fcm = function(deviceIds, path, eventName) {
  // Prepare a message to be sent
  console.log("Name", eventName);
  var message = new gcm.Message({
      data: { path : path, eventName : eventName }
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
