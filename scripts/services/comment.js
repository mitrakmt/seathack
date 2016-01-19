'use strict';

app.factory('Comment', function(FURL, $firebase) {

	var ref = new Firebase(FURL);

	var Comment = {
		comments: function(ideaId) {
			return $firebase(ref.child('comments').child(ideaId)).$asArray();
		},

		addComment: function(ideaId, comment) {
			var idea_comments = this.comments(ideaId);
			comment.datetime = Firebase.ServerValue.TIMESTAMP;

			if(idea_comments) {
				return idea_comments.$add(comment);
			}
		}
	};

	return Comment;
});
