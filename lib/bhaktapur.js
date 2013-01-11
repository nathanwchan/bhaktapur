Volunteers = new Meteor.Collection("volunteers");

if (Meteor.isClient) {
  Template.volunteerlist.volunteers = function () {
    return Volunteers.find({}, {sort: {name: -1}});
  };
}