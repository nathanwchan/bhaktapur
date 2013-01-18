Meteor.startup(function () {
	filepicker.setKey('AGtZv8CFvQABLy5q9bn2Lz');
});

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

Meteor.subscribe("comments", function(){
	Session.set('commentsLoaded', true);
});

Meteor.subscribe("photos", function(){
	Session.set('photosLoaded', true);
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

Template.project.userId = function () {
	return Session.get("id");
};

Template.project.projectId = function () {
	return this._id;
};

Template.project.photosLoaded = function () {
	return Session.get('photosLoaded');
};

var getAllPhotos = function (project_id) {
	// return Photos.find({project_id: project_id}, {limit: defaultShownPhotosCount, sort: {date: -1}}).fetch().reverse();
	return Photos.find({project_id: project_id}, {sort: {date: -1}}).fetch();
}

Template.project.latestPhotos = function () {
	return getAllPhotos(this._id).slice(0, defaultShownPhotosCount).reverse();
}

Template.project.morePhotos = function () {
	return (getAllPhotos(this._id).length > defaultShownPhotosCount);
}

Template.project.date = function () {
	return moment(this.date).fromNow();
}

Template.project.commentsLoaded = function () {
	return Session.get('commentsLoaded');
}

Template.project.comments = function () {
	return Comments.find({project_id: this._id}, {limit: defaultShownCommentsCount, sort: {date: -1}}).fetch().reverse();
}

var getRemainingComments = function (project_id) {
	return Comments.find({project_id: project_id}, {skip: defaultShownCommentsCount, sort: {date: -1}}).fetch().reverse();
}

Template.project.remainingComments = function () {
	return getRemainingComments(this._id);
}

Template.project.remainingCommentsCount = function () {
	return getRemainingComments(this._id).length;
}

Template.project.hasMoreComments = function () {
	return Comments.find({project_id: this._id}).count() > defaultShownCommentsCount;
}

Template.comment.date = function () {
	return moment(this.date).fromNow();
}

Template.projects.events({
  "click #add-project-button": function () {
	Session.set("photosToUpload", false);
	Session.set("photosToUploadJson", null);
	$('#photosToUploadDiv').empty();
  }
});

Template.project.events({
  "click #sign-in-to-edit": function () {
    showLoginPopup();
  },
  "click #sign-in-to-comment": function () {
    showLoginPopup();
  },
  "click #edit-project": function () {
  	$('#projectId_edit').attr("value", this._id)
  	$('#name_edit').attr("value", this.name);
	$('#description_edit').attr("value", this.description);
	Session.set("photosToUpload", false);
	Session.set("photosToUploadJson", null);
	$('#photosToUploadDiv_edit').empty();
  },
  "keypress input.comment-textbox": function (evt) {
  	var self = this;
    if (evt.which === 13
    	&& $('#project-' + self._id + '-comment-textbox').val() !== ""
    	&& $('#project-' + self._id + '-comment-textbox').attr('disabled') !== "disabled") {
    	$('#submitSpinner-project-' + self._id + '-comment').css("visibility", "visible");
		$('#project-' + self._id + '-comment-textbox').attr("disabled", true);
		Meteor.call('addComment',
			self._id,
			Session.get("id"),
			Session.get("userName"),
			$('#project-' + self._id + '-comment-textbox').val(),
			function (error, result) {
				$('#submitSpinner-project-' + self._id + '-comment').css("visibility", "hidden");
  				$('#project-' + self._id + '-comment-textbox').attr("value", "");
				$('#project-' + self._id + '-comment-textbox').removeAttr("disabled");
			});
    }
  },
  "click a.comments-toggle-link": function () {
  	var self = this;
  	if ($('#comments-toggle-link-project-' + self._id).attr("class").indexOf("collapsed") !== -1) {
  		$('#comments-toggle-link-project-' + self._id).prop("innerHTML", "hide comments");
  	}
  	else {
  		$('#comments-toggle-link-project-' + self._id).prop("innerHTML", "see " + getRemainingComments(self._id).length + " more comments");
  	}
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
			$('#name').val(),
			$('#description').val(),
			Session.get("id"),
			Session.get("userName"),
			function (error, new_project_id) {
				if (!new_project_id) {
					$('#name_error').prop("innerHTML", "Give the project a name!");
					$('#submitButton').removeAttr("disabled");
					$('#submitSpinner').css("visibility", "hidden")
				}
				else {
					$('#addproject').modal('hide');
					$('#submitButton').removeAttr("disabled");
					$('#submitSpinner').css("visibility", "hidden");
					$('#name').attr("value", "");
					$('#description').attr("value", "");
					if (Session.get("photosToUpload")) {
						fpfiles = JSON.parse(Session.get("photosToUploadJson"));
						return _.each(fpfiles, function(image) {
							Meteor.call('addPhoto',
								new_project_id,
								Session.get("id"),
								Session.get("userName"),
								image.filename,
								image.url
							);
						});
					}
				}
			});
	},
	'click #uploadPhotosButton': function() {
		return filepicker.pickAndStore({multiple: true},{},function(fpfiles){
			Session.set("photosToUpload", true);
			if (!Session.get("photosToUploadJson")) {
				Session.set("photosToUploadJson", JSON.stringify(fpfiles));
			}
			else {
				Session.set("photosToUploadJson", JSON.stringify(JSON.parse(Session.get("photosToUploadJson")).concat(JSON.parse(JSON.stringify(fpfiles)))));
			}
			return _.each(fpfiles, function(image) {
				$('#photosToUploadDiv').append('<img src="' + image.url + '" height="100" width="100" />');
			});
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
		if (Session.get("photosToUpload")) {
			fpfiles = JSON.parse(Session.get("photosToUploadJson"));
			return _.each(fpfiles, function(image) {
				Meteor.call('addPhoto',
					$('#projectId_edit').val(),
					Session.get("id"),
					Session.get("userName"),
					image.filename,
					image.url
				);
			});
		}
	},
	'click #uploadPhotosButton_edit': function() {
		return filepicker.pickAndStore({multiple: true},{},function(fpfiles){
			Session.set("photosToUpload", true);
			if (!Session.get("photosToUploadJson")) {
				Session.set("photosToUploadJson", JSON.stringify(fpfiles));
			}
			else {
				Session.set("photosToUploadJson", JSON.stringify(JSON.parse(Session.get("photosToUploadJson")).concat(JSON.parse(JSON.stringify(fpfiles)))));
			}
			return _.each(fpfiles, function(image) {
				$('#photosToUploadDiv_edit').append('<img src="' + image.url + '" height="100" width="100" />');
			});
		});
	}
};

Template.editProjectModal.photosToUpload = function () {
	var photosToUploadString = Session.get("photosToUploadJson");
	if (!photosToUploadString) {
		return photosToUploadString;
	}
	return JSON.parse(photosToUploadString);
};

Template.editProjectModal.nathan = function () {
	return Session.get("photosToUploadJson");
}
