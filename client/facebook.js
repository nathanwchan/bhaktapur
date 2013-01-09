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

  var setUserName = function (userName) {
    Session.set("userName", userName);
  };

  var logout = function () {
    _.extend(sessionKeys, {"accessToken": true, "userName": true, "datesAndEvents": true});
    _.each(_.keys(sessionKeys), function (k) {
      Session.set(k, null);
    });
    sessionKeys = {};
  };

  return {
    login: login,
    getAccessToken: getAccessToken,
    getUserName: getUserName,
    logout: logout
  };
}());