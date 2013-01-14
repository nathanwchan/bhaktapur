Meteor.publish("volunteers", function() {
    return Volunteers.find({});
});

Meteor.publish("projects", function() {
    return Projects.find({});
});