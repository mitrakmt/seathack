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
			return ideas.$add(idea);
      $location.path('/browse');
		},

		editIdea: function(idea) {
			var t = this.getIdea(idea.$id);
			return t.$update({title: idea.title, description: idea.description});
		},

		cancelIdea: function(ideaId) {
			var t = this.getIdea(ideaId);
			return t.$update({status: "Deleted."});
		},

		isCreator: function(idea) {
			return (user && user.provider && user.uid === idea.poster);
		},

		isOpen: function(idea) {
			return idea.status === "open";
		}
	};

	return Idea;

});
