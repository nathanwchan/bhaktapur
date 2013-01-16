Meteor.methods({
  addProject: function (name, description, user_id, user_name) {
    if (!name)
      throw new Meteor.Error(404, "Must provide project name!");
    var date = (new Date()).getTime();
    Projects.insert({
      name: name,
      description: description,
      date: date,
      last_modified_by_id: user_id,
      last_modified_by_name: user_name
    });
    return true;
  },

  editProject: function (id, name, description, user_id, user_name) {
    if (!name)
      throw new Meteor.Error(404, "Must provide project name!");
    var date = (new Date()).getTime();
    Projects.update(
      {_id: id},
      {
        name: name,
        description: description,
        date: date,
        last_modified_by_id: user_id,
        last_modified_by_name: user_name
      }
    );
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