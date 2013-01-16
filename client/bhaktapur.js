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

Template.project.isLogged = function () {
  	return (Session.get("accessToken") || null) !== null;
};

Template.project.events({
  "click #sign-in": function () {
    showLoginPopup();
  },
  "click #edit-project": function () {
  	$('#projectId_edit').attr("value", this._id)
  	$('#name_edit').attr("value", this.name);
	$('#description_edit').attr("value", this.description);
  }
});

Template.users.users = function () {
	return Users.find({}, {sort: {name: -1}});
};

Template.users.usersLoaded = function () {
	return Session.get('usersLoaded');
};

Template.addProjectModal.events = {
	'click input.submit': function () {
		$('#name_error').prop("innerHTML", "");
		$('#submitButton').attr("disabled", true);
		$('#submitSpinner').css("visibility", "visible")
		Meteor.call('addProject',
			$('input#name').val(),
			$('textarea#description').val(),
			Session.get("id"),
			Session.get("userName"),
			function (error, result) {
				if (!result) {
					$('#name_error').prop("innerHTML", "Give the project a name!");
					$('#submitButton').removeAttr("disabled");
					$('#submitSpinner').css("visibility", "hidden")
				}
				else {
					$('#addproject').modal('hide');
					$('#submitButton').removeAttr("disabled");
					$('#submitSpinner').css("visibility", "hidden");
					$('input#name').attr("value", "");
					$('textarea#description').attr("value", "");
				}
			});
	}
};

Template.editProjectModal.events = {
	'click input.submit': function () {
		$('#name_error_edit').prop("innerHTML", "");
		$('#submitButton_edit').attr("disabled", true);
		$('#submitSpinner_edit').css("visibility", "visible")
		Meteor.call('editProject',
			$('#projectId_edit').val(),
			$('#name_edit').val(),
			$('#description_edit').val(),
			Session.get("id"),
			Session.get("userName"),
			function (error, result) {
				if (!result) {
					$('#name_error_edit').prop("innerHTML", "Give the project a name!");
					$('#submitButton_edit').removeAttr("disabled");
					$('#submitSpinner_edit').css("visibility", "hidden")
				}
				else {
					$('#editproject').modal('hide');
					$('#submitButton_edit').removeAttr("disabled");
					$('#submitSpinner_edit').css("visibility", "hidden");
					$('#name_edit').attr("value", "");
					$('#description_edit').attr("value", "");
				}
			});
	}
};