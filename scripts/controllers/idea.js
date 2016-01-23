'use strict';

app.controller('IdeaController', function($scope, $location, toaster, Idea, Auth) {

	$scope.createIdea = function() {
		$scope.idea.status = 'open';
		$scope.idea.gravatar = Auth.user.profile.gravatar;
		$scope.idea.name = Auth.user.profile.name;
		$scope.idea.poster = Auth.user.uid;

		Idea.createIdea($scope.idea).then(function(ref) {
			toaster.pop('success', 'Idea created successfully.');
			$scope.idea = {title: '', description: '', status: 'open', gravatar: '', name: '', poster: ''};
			$location.path('/browse/' + ref.key());
		});
	};

	$scope.editIdea = function(idea) {
		Idea.editIdea(idea).then(function() {
			toaster.pop('success', "Your idea is updated.");
		});
	};

});
