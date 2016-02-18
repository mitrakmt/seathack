'use strict';

app.factory('Idea', function(FURL, $firebase, Auth) {
  var ref = new Firebase(FURL);
  var ideas = $firebase(ref.child('ideas')).$asArray();
	var user = Auth.user;

	var Idea = {
		all: ideas,

		getIdea: function(ideaId) {
			return $firebase(ref.child('ideas').child(ideaId));
		},

		createIdea: function(idea) {
			idea.datetime = Firebase.ServerValue.TIMESTAMP;
      return ideas.$add(idea).then(function(newIdea) {

      var obj = {
					ideaId: newIdea.key(),
					title: idea.title,
          description: idea.description
				};

				return $firebase(ref.child('user_ideas').child(idea.poster)).$push(obj);
			});
		},

    createUserIdeas: function(ideaId) {
			Idea.getIdea(ideaId)
				.$asObject()
				.$loaded()
				.then(function(idea) {

					// Create User-Ideas lookup record for runner
					var obj = {
            ideaId: ideaId,
  					title: idea.title,
            description: idea.description
					}

					return $firebase(ref.child('user_joins').child(idea.poster)).$push(obj);
          return $firebase(ref.child('user_ideas').child(idea.runner)).$push(obj);
				});
		},

		editIdea: function(idea) {
			var t = this.getIdea(idea.$id);
			return t.$update({title: idea.title, description: idea.description});
		},

		cancelIdea: function(ideaId) {
			var t = this.getIdea(ideaId);
			return t.$remove();
		},

		isCreator: function(idea) {
			return (user && user.provider && user.uid === idea.poster);
		},

		isOpen: function(idea) {
			return idea.status === "open";
		},

    isOnTeam: function(idea) {
			return (user && user.provider && user.uid === idea.runner);
		},

    isFull: function(idea) {
			return idea.status === "full";
		}
	};

	return Idea;

});
