var facebook = (function () {
  var fbDateFormats = ["YYYY-MM-DDThh:mm:ssZZ", "YYYY-MM-DD", "YYYY-MM-DDThh:mm:ss"];
  var sessionKeys = {};

  var login = function (accessToken) {
    return Session.set("accessToken", accessToken);
  };

  var getAccessToken = function () {
    return Session.get("accessToken") || null;
  };

  var getUserName = function () {
    return Session.get("userName") || null;
  };

  var getUserId = function () {
    return Session.get("id") || null;
  };

  var setUserInfo = function (json) {
    userid = json.id;
    username = json.name;
    Session.set("id", userid);
    Session.set("userName", username);
    if (Session.get("usersLoaded"))
    {
      Meteor.call('addUser', userid, username);
    }
  };

  var fetchInfo = function () {
    var accessToken = getAccessToken();
    if (accessToken !== null) {
      var url = "https://graph.facebook.com/me?fields=id,name";
      url += "&access_token=" + accessToken;
      Meteor.http.get(url, {timeout: 30000}, processInfo);
    }
  };

  var processInfo = function (error, result) {
    if (result.statusCode === 200) {
      var json = JSON.parse(result.content);
      setUserInfo(json);
    }
  };

  var logout = function () {
    _.extend(sessionKeys, {"accessToken": true, "userName": true, "id": true});
    _.each(_.keys(sessionKeys), function (k) {
      Session.set(k, null);
    });
    sessionKeys = {};
  };

  Meteor.autorun(fetchInfo);

  return {
    login: login,
    getAccessToken: getAccessToken,
    getUserName: getUserName,
    getUserId: getUserId,
    logout: logout
  };
}());