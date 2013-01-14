Meteor.methods({
  addProject: function (name, description) {
    // .. do stuff ..
    if (!name)
      throw new Meteor.Error(404, "Must provide project name!");
    var date = (new Date()).getTime();
    Projects.insert({name: name, description: description, date: date});
    return true;
  },

  bar: function () {
    // .. do other stuff ..
    return "baz";
  }
});