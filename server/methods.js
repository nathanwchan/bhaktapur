Meteor.methods({
  addProject: function (name, description, type, user_id, user_name) {
    if (!name)
      throw new Meteor.Error(404, "Must provide project name!");
    var date = (new Date()).getTime();
    return Projects.insert({
      name: name,
      description: description,
      type: type,
      date: date,
      last_modified_by_id: user_id,
      last_modified_by_name: user_name
    });
  },

  editProject: function (id, name, description, type, user_id, user_name) {
    if (!name)
      throw new Meteor.Error(404, "Must provide project name!");
    var date = (new Date()).getTime();
    Projects.update(
      {_id: id},
      {
        name: name,
        description: description,
        type: type,
        date: date,
        last_modified_by_id: user_id,
        last_modified_by_name: user_name
      }
    );
    return true;
  },

  markProjectComplete: function (id, user_id, user_name) {
    var date = (new Date()).getTime();
    Projects.update(
      {_id: id},
      {$set:
        {
          type: "3",
          date: date,
          last_modified_by_id: user_id,
          last_modified_by_name: user_name
        }
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
    return true;
  },

  addUser: function (id, name, email) {
    if (!Users.findOne({id: id}))
    {
      Users.insert({
        id: id,
        name: name,
        email: email
      })
    }
    return true;
  },

  addComment: function (project_id, user_id, user_name, comment) {
    if (!comment)
      throw new Meteor.Error(404, "Comment can't be blank!");
    var date = (new Date()).getTime();
    Comments.insert({
      project_id: project_id,
      user_id: user_id,
      user_name: user_name,
      comment: comment,
      date: date
    });
    return true;
  },

  addPhoto: function (project_id, user_id, user_name, photo_name, photo_url) {
    var date = (new Date()).getTime();
    Photos.insert({
      project_id: project_id,
      user_id: user_id,
      user_name: user_name,
      photo_name: photo_name,
      photo_url: photo_url,
      date: date
    });
    return true;
  }
});