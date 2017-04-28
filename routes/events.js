var mongoose = require('mongoose');
var db = require('../models/db.js');

var Event = mongoose.model('Event');

//create event
module.exports.createEvent = function(req, res) {
  console.log("In Create Event");
  //Get values from body sent within request
  var eventName = req.body.eventName;
  var eventDescription = req.body.eventDescription;
  var eventRule = req.body.eventRule;
  var eventVenue = req.body.eventVenue;
  var eventPoints = req.body.eventPoints;
  var eventTime = req.body.eventTime;
  var eventDate = req.body.eventDate;

  //Creating new team and assigning values
  var newEvent = new Event();
  newEvent.eventName = eventName;
  newEvent.description = eventDescription;
  newEvent.rules = eventRule;
  newEvent.venue = eventVenue;
  newEvent.maxPoints = eventPoints;
  newEvent.eventTime = eventTime;
  newEvent.eventDate = eventDate;

  //saving data to mongodb
  newEvent.save(function(err, savedEvent) {
    if(err) {
      var message="Error in creating "+eventName;
			console.log(message);
      res.status(500).send({'statusMessage' : 'error', 'message' : message});
		} else {
			var message="a new event added with name "+savedEvent.eventName;
      res.status(201).send({'statusMessage' : 'success', 'message' : message, "event":savedEvent});
		}
  });
}

//Get All events
module.exports.getAllEvents = function(req, res) {
  Event.find(function(err, events) {
    if (err) {
      res.status(500).send({'statusMessage' : 'error', 'message' : 'Internal server error'});
    }
    if (events != null && events.length > 0) {
      res.status(200).send({'statusMessage' : 'success', 'message' : 'Events data available under events attributes','events' : events});
    } else {
      res.status(200).send({'statusMessage' : 'error', 'message' : 'No events data available'});
    }
  });
}
