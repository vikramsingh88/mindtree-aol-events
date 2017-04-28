var mongoose = require('mongoose');
var db = require('../models/db.js');
var fs = require('fs');

var Team = mongoose.model('Team');
var TeamMember = mongoose.model('TeamMember');

//create team
module.exports.createTeam = function(req, res) {
  console.log('In Create team function');
  //Get values from body sent within bodyParser
  var teamName = req.body.teamName;

  console.log('Team name', teamName);
  //Creating new team and assigning values
  var newTeam = new Team();
  newTeam.teamName = teamName;
  //saving team data to mongodb
  newTeam.save(function(err, savedTeam) {
    if(err) {
      var message=err;
			console.log(message);
      res.status(500).send({'statusMessage' : 'error', 'message' : message});
		} else {
			var message="a new team added with name "+savedTeam.teamName;
      res.status(201).send({'statusMessage' : 'success', 'message' : message});
		}
  });
}

//add team member to given team
module.exports.addTeamMember = function(req, res) {
  console.log('In add member function');
  //get value from url
  var teamName = req.params.teamName;
  //Get values from body sent within bodyParser
  var teamMemberName = req.body.memberName;
  var aboutMember = req.body.about;
  console.log('Team name', teamName);
  //Creating new team and assigning values
  var newTeamMember = new TeamMember();
  newTeamMember.teamName = teamName;
  newTeamMember.memberName = teamMemberName;
  newTeamMember.aboutMember = aboutMember;
  //saving team data to mongodb
  newTeamMember.save(function(err, savedMember) {
    if(err) {
      var message=err;
			console.log(message);
      res.status(500).send({'statusMessage' : 'error', 'message' : message});
		} else {
			var message="a new member added with name "+savedMember.memberName;
      res.status(201).send({'statusMessage' : 'success', 'message' : message, 'member' : savedMember});
		}
  });
}

//Get all member from a team
module.exports.getTeamMember = function(req, res) {
  var teamName = req.params.teamName;
  console.log('getTeamMember', teamName);
  TeamMember.find({'teamName':teamName}, function(err, teamMembers) {
    if (err) {
      res.status(500).send({'statusMessage' : 'error', 'message' : 'Internal server error'});
    }
    if (teamMembers == null) {
      res.status(200).send({'statusMessage' : 'error', 'message' : 'No team data available'});
    } else {
      res.status(200).send({'statusMessage' : 'success', 'message' : 'Team data available','teamMembers' : teamMembers});
    }
  });
}

//Get team of given team name
module.exports.getTeam = function(req, res) {
  var tName = req.params.teamName;
  console.log('Team name GET', tName);
  Team.findOne({'teamName':tName}, function(err, team) {
    if (err) {
      res.status(500).send({'statusMessage' : 'error', 'message' : 'Internal server error'});
    }
    if (team == null) {
      res.status(200).send({'statusMessage' : 'error', 'message' : 'No team data available'});
    } else {
      res.status(200).send({'statusMessage' : 'success', 'message' : 'Team data available','team' : team});
    }
  });
}

//Get all teams
module.exports.getTeams = function(req, res) {
  Team.find({},'teamName', function(err, teams) {
    if (err) {
      res.status(500).send({'statusMessage' : 'error', 'message' : 'Internal server error'});
    }
    if (teams != null && teams.length > 0) {
      res.status(200).send({'statusMessage' : 'success', 'message' : 'Teams data available under teams attributes','teams' : teams});
    } else {
      res.status(200).send({'statusMessage' : 'error', 'message' : 'No teams data available'});
    }
  });
}

//Get Team logo by team name
module.exports.getTeamLogo = function(req, res) {
  var tName = req.params.teamName;
  console.log('GET team logo', tName);
  Team.findOne({'teamName':tName}, 'teamLogo', function(err, teamLogo) {
    if (err) {
      res.status(500).send({'statusMessage' : 'error', 'message' : 'Internal server error'});
    }
    if (teamLogo == null) {
      res.status(200).send({'statusMessage' : 'error', 'message' : 'No team logo available'});
    } else {
      res.setHeader('content-type', 'image/png');
      res.status(200).send({teamLogo});
    }
  });
}

//Get Team banner by team name
module.exports.getTeamBanner = function(req, res) {
  var tName = req.params.teamName;
  console.log('GET team banner', tName);
  Team.findOne({'teamName':tName}, 'teamBanner', function(err, teamBanner) {
    if (err) {
      res.status(500).send({'statusMessage' : 'error', 'message' : 'Internal server error'});
    }
    if (teamBanner == null) {
      res.status(200).send({'statusMessage' : 'error', 'message' : 'No team banner available'});
    } else {
      //res.setHeader('content-type', 'image/png');
      var buffer = teamBanner.teamBanner.data;
      var encodedBuffer = buffer.toString('base64');
      console.log('GET team banner', encodedBuffer);
      res.status(200).send(encodedBuffer);
    }
  });
}
