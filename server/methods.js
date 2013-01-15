Meteor.methods({
  addProject: function (name, description) {
    // .. do stuff ..
    if (!name)
      throw new Meteor.Error(404, "Must provide project name!");
    var date = (new Date()).getTime();
    Projects.insert({
      name: name,
      description: description,
      date: date
    });
    return true;
  },

  addVolunteer: function (id, name) {
    if (!Volunteers.findOne({id: id}))
    {
      Volunteers.insert({
        id: id,
        name: name
      })
    }
  },

  addUser: function (id, name) {
    if (!Users.findOne({id: id}))
    {
      Users.insert({
        id: id,
        name: name
      })
    }
  }
});