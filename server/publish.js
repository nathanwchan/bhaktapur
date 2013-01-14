Meteor.publish("volunteers", function() {
    return Volunteers.find({});
});