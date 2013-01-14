Meteor.subscribe("volunteers", function(){
	Session.set('volunteersLoaded', true);
});

Template.volunteerlist.volunteers = function () {
	return Volunteers.find({}, {sort: {name: -1}});
};

Template.volunteerlist.volunteersLoaded = function () {
	return Session.get('volunteersLoaded');
};
