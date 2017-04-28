var express = require('express');
var bodyParser = require('body-parser');
var team = require('./routes/team.js');
var events = require('./routes/events.js');
var device = require('./routes/device.js');
var comingSoon = require('./routes/comingsoon.js');

var app = express();

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({extended:false}));

var port = process.env.PORT || 8080;

//Create team
app.post('/team', team.createTeam);
//Add team member to given team
app.post('/team/:teamName/member', team.addTeamMember);
//Get all team
app.get('/team', team.getTeams);
//Get team  of given team name
app.get('/team/:teamName', team.getTeam);
//get all members from a team
app.get('/team/:teamName/member', team.getTeamMember);
//get team logo by team name
app.get('/team/logo/:teamName', team.getTeamLogo);
//get team banner by team name
app.get('/team/banner/:teamName', team.getTeamBanner);
//Create eventName
app.post('/event', events.createEvent);
//Get All events
app.get('/event', events.getAllEvents);
//register device id for FCM
app.post('/device', device.registerDevice);
//send notification
app.post('/notify', device.notify);
//Create comming soon
app.post('/comingsoon', comingSoon.createComingSoon);
//Get coming soon by name
app.get('/comingsoon/:eventName', comingSoon.getComingSoon);

//for error handling
app.use(function(req, res) {
     res.status(404).send('404 Page not found');
});

app.use(function(error, req, res, next) {
     res.status(500).send('500 Server internal error');
});

//start server on PORT
app.listen(port, function() {
  console.log('Server is running on port ',port);
});
