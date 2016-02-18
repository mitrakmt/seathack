'use strict';

app.factory('Join', function(FURL, $firebase, $q, Auth, Idea) {
	var ref = new Firebase(FURL);
	var user = Auth.user;

	var Join = {
		joins: function(ideaId) {
			return $firebase(ref.child('joins').child(ideaId)).$asArray();
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

		isMaker: function(join) {
			return (user && user.provider && user.uid === join.uid);
		},

		getJoin: function(ideaId, joinId) {
			return $firebase(ref.child('joins').child(ideaId).child(joinId));
		},

    cancelJoin: function(ideaId, joinId) {
			return this.getJoin(ideaId, joinId).$remove();
		},

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
		}

	};

	return Join;

});
