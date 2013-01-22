Meteor.startup(function () {
	filepicker.setKey('AGtZv8CFvQABLy5q9bn2Lz');
	Session.set('page', 0);
});

Meteor.subscribe("users", function(){
	Session.set('usersLoaded', true);
	userid = Session.get("id");
	username = Session.get("userName");
	useremail = Session.get("userEmail");
	if (!!userid)
	{
		Meteor.call('addUser', userid, username, useremail);
	}
});

Meteor.subscribe("projects", function(){
	Session.set('projectsLoaded', true);
	Session.set('projectTypeFilter', "0")
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

Template.navbar.events({
  "click .navbar-tab": function (event) {
  	var navbarLinkClicked = event.currentTarget;
  	$('.navbar-tab').each(function() {
		var navbarLink = $(this);
		if(navbarLink.get(0) === navbarLinkClicked) {
			navbarLink.addClass('active');
			Session.set('page', navbarLink.get(0).value);
		}
		else {
			navbarLink.removeClass('active');
		}
    });
  }
});

Template.pages.pageIs = function (page) {
	if(Session.get('page')){
		return Session.get('page').toString() === page;
	}
	return false;
};

Template.volunteers.volunteers = function () {
	return Volunteers.find({}, {sort: {name: -1}});
};

Template.volunteers.volunteersLoaded = function () {
	return Session.get('volunteersLoaded');
};

Template.projectsPage.isLogged = function () {
  	return (Session.get("accessToken") || null) !== null;
};

Template.projects.projectsType0 = function () {
	return Projects.find({}, {sort: {date: -1}});
};

Template.projects.projectsType1 = function () {
	return Projects.find({type: "1"}, {sort: {date: -1}});
};

Template.projects.projectsType2 = function () {
	return Projects.find({type: "2"}, {sort: {date: -1}});
};

Template.projects.projectTypeFilterIs = function (projectTypeFilter) {
	return Session.get('projectTypeFilter') === projectTypeFilter;
};

Template.projects.projectsLoaded = function () {
	return Session.get('projectsLoaded');
};

Template.projects.projectTypeFilter = function () {
	return Session.get('projectTypeFilter');
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

Template.project.showType = function () {
	return Session.get('projectTypeFilter') === "0";
};

Template.project.type = function () {
	if (this.type) {
		return projectTypes[this.type];
	}
	return projectTypes["0"];
};

Template.project.photosLoaded = function () {
	return Session.get('photosLoaded');
};

var getAllPhotos = function (project_id) {
	return Photos.find({project_id: project_id}, {sort: {date: -1}}).fetch();
}

Template.project.latestPhotos = function () {
	return getAllPhotos(this._id).slice(0, defaultShownPhotosCount);
}

Template.project.morePhotos = function () {
	return (getAllPhotos(this._id).length > defaultShownPhotosCount);
}

Template.project.firstOfRemainingPhotos = function () {
	return getAllPhotos(this._id)[defaultShownPhotosCount].photo_url;
}

Template.project.remainingPhotos = function () {
	return getAllPhotos(this._id).slice(defaultShownPhotosCount + 1);
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

Template.project.remainingCommentsCountNotOne = function () {
	return getRemainingComments(this._id).length !== 1;
}

Template.project.hasMoreComments = function () {
	return Comments.find({project_id: this._id}).count() > defaultShownCommentsCount;
}

Template.photo.projectId = function () {
	return this.project_id;
}

Template.comment.date = function () {
	return moment(this.date).fromNow();
}

Template.projectsPage.events({
  "click #add-project-button": function () {
	Session.set("photosToUpload", false);
	Session.set("photosToUploadJson", null);
	$('#photosToUploadDiv').empty();
  },
  "click .project-nav-tab-link": function (event) {
  	var navTabLinkValue = event.currentTarget.getAttribute("value");
  	Session.set('projectTypeFilter', navTabLinkValue);
  	element_to_scroll_to = document.getElementById('projects-anchor');
	element_to_scroll_to.scrollIntoView();
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
  	var self = this;
  	$('#projectId_edit').attr("value", self._id)
  	$('#name_edit').attr("value", self.name);
	$('#description_edit').attr("value", self.description);
	var projectType = "0";
	if (self.type) {
		projectType = self.type;
	}
	$('#project_type_button_value_edit').attr("value", projectType);
	$('.project-type-button-edit').each(function(index) {
		var button = $(this);
		if(projectType === (index+1).toString()) {
			button.addClass('active');
		}
		else {
			button.removeClass('active');
		}
    });
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
				element_to_scroll_to = document.getElementById('project_' + self._id + '_anchor');
				element_to_scroll_to.scrollIntoView();
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
			$('#project_type_button_value').val(),
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
  					Session.set('projectTypeFilter', "0");
					$('.project-nav-tab').each(function(index) {
						var listitem = $(this);
						if(index === 0) {
							listitem.addClass('active');
						}
						else {
							listitem.removeClass('active');
						}
				    });
					element_to_scroll_to = document.getElementById('projects-anchor');
					element_to_scroll_to.scrollIntoView();
				}
			});
	},
	'click .project-type-button': function(event) {
		$('#project_type_button_value').attr("value", event.currentTarget.value);
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
			$('#project_type_button_value_edit').val(),
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
					element_to_scroll_to = document.getElementById('projects-anchor');
					element_to_scroll_to.scrollIntoView();
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
	'click .project-type-button-edit': function(event) {
		$('#project_type_button_value_edit').attr("value", event.currentTarget.value);
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
