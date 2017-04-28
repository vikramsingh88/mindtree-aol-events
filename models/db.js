var mongoose = require('mongoose');
//var dbURI = 'mongodb://localhost/mevents';
var dbURI = 'mongodb://vikram:password@ds161059.mlab.com:61059/chat';

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to '+dbURI);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error '+err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

//saving logo and banner images in base64 format
var teamSchema = new mongoose.Schema({
		teamName: { type: String, unique: true },
    teamLogo: { data: Buffer, contentType: String },
		teamBanner: { data: Buffer, contentType: String },
		teamColor : {type: String}
});

//team member to given team
var teamMemberSchema = new mongoose.Schema({
		teamName: { type: String},
		memberName: { type: String},
    aboutMember: { type: String},
		memberPic: { data: Buffer, contentType: String },
});

//schema for events
var eventSchema = new mongoose.Schema({
	eventName : {type:String, unique:true},
	description : String,
	rules : String,
	venue : String,
	maxPoints : String,
	eventTime : String,
	eventDate : String,
	eventBanner : { data: Buffer, contentType: String }
});

//FCM device registration
var deviceSchema = new mongoose.Schema({
	registrationId : String
});

//Coming soon Schema
var comingSoonSchema = new mongoose.Schema({
	eventName : {type : String, unique : true},
	eventBannerPath : { type : String }
});

// Build the Team model
mongoose.model('Team', teamSchema);
//build team member model
mongoose.model('TeamMember', teamMemberSchema);
//Build Event model
mongoose.model('Event',eventSchema);
//Build Device model
mongoose.model('Device', deviceSchema);
//Build coming soon model
mongoose.model('ComingSoon', comingSoonSchema);
