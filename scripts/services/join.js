'use strict';

app.factory('Join', function(FURL, $firebase, $q, Auth, Idea) {
	var ref = new Firebase(FURL);
	var user = Auth.user;

	var Join = {
		joins: function(ideaId) {
			return $firebase(ref.child('joins').child(ideaId)).$asArray();
		},

		allJoins: function() {
			return $firebase(ref.child('joins')).$asArray();
		},

		makeJoin: function(ideaId, join) {
			var idea_joins = this.joins(ideaId);

			if(idea_joins) {
				return idea_joins.$add(join);
			}
		},

		// This function is to check if the logged-in user already joined this idea.
		// This is to prevent a user from joining more than 1.
		isJoined: function(ideaId) {

			if(user && user.provider) {
				var d = $q.defer();

				$firebase(ref.child('joins').child(ideaId).orderByChild("uid")
					.equalTo(user.uid))
					.$asArray()
					.$loaded().then(function(data) {
						d.resolve(data.length > 0);
					}, function() {
						d.reject(false);
					});

				return d.promise;
			}

		},

		createUserJoins: function(joinId) {
			Join.getJoin(joinId)
				.$asObject()
				.$loaded()
				.then(function(join) {

					// Create User-Joins lookup record for profile
					var obj = {
            ideaId: ideaId,
  					title: idea.title,
            description: idea.description
					}

					return $firebase(ref.child('user_joins').child(join.poster)).$push(obj);
				});
		},

		isMaker: function(join) {
			return (user && user.provider && user.uid === join.uid);
		},

// -------------- Delete joins object on team leave ---------

		getJoin: function(ideaId, joinId) {
			return $firebase(ref.child('joins').child(ideaId).child(joinId));
		},

    cancelJoin: function(ideaId, joinId) {
			return this.getJoin(ideaId, joinId).$remove();
		},

// --------------- Add user_joins object on validate -------------

		acceptJoin: function(ideaId, joinId, runnerId) {

			var o = this.getJoin(ideaId, joinId);
			return o.$update({open: true})
				.then(function() {

					var t = Idea.getIdea(ideaId);
					return t.$update({status: "open", runner: runnerId});
				})
				.then(function() {

					return Idea.createUserIdeas(ideaId);
				});
		},

		// -------------- Delete user_joins object on team leave validate ---------

			resetJoin: function(ideaId, joinId, runnerId) {

				var ideaToBeUpdated = this.getJoin(ideaId, joinId);
				return ideaToBeUpdated.$update({open: true})
					.then(function() {

						var t = Idea.getIdea(ideaId);
						return t.$update({status: "open", runner: 'null'});
					})
					.then(function() {

						console.log('hey');
						return Idea.replaceUserJoins(ideaId);
					});
			}

	};

	return Join;

});
