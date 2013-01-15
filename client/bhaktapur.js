Meteor.subscribe("users", function(){
	Session.set('usersLoaded', true);
	userid = Session.get("id");
	username = Session.get("userName")
	if (!!userid && !!username)
	{
		Meteor.call('addUser', userid, username);
	}
});

Meteor.subscribe("projects", function(){
	Session.set('projectsLoaded', true);
});

Meteor.subscribe("volunteers", function(){
	Session.set('volunteersLoaded', true);
});

Template.volunteers.volunteers = function () {
	return Volunteers.find({}, {sort: {name: -1}});
};

Template.volunteers.volunteersLoaded = function () {
	return Session.get('volunteersLoaded');
};

Template.projects.projects = function () {
	return Projects.find({}, {sort: {date: -1}});
};

Template.projects.projectsLoaded = function () {
	return Session.get('projectsLoaded');
};

Template.users.users = function () {
	return Users.find({}, {sort: {name: -1}});
};

Template.users.usersLoaded = function () {
	return Session.get('usersLoaded');
};

Template.modals.events = {
	'click input.add': function () {
		Meteor.call('addProject',
			$('input#name').val(),
			$('textarea#description').val(),
			function (error, result) {
				if (!result) {
					$('#name_error').prop("innerHTML", "Give the project a name!");
				}
				else {
					$('#addproject').modal('hide');
				}
			});
	}
};