Meteor.publish("volunteers", function() {
    return Volunteers.find({});
});

Meteor.publish("projects", function() {
    return Projects.find({});
});

Meteor.publish("users", function() {
    return Users.find({});
});

Meteor.publish("comments", function() {
    return Comments.find({});
});

Meteor.publish("photos", function() {
    return Photos.find({});
});