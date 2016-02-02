'use strict'

  app.factory('Profile', function(FURL, $firebase, $q) {
    var ref = new Firebase(FURL);

    var Profile = {

      getIdeasForUser: function(uid) {
  			var defer = $q.defer();

        $firebase(ref.child('user_ideas').child(uid))
  				.$asArray()
  				.$loaded()
  				.then(function(ideas) {
  					defer.resolve(ideas);
  				}, function(err) {
  					defer.reject();
  				});

  			return defer.promise;
		  }
	};

	return Profile;

  });
