'use strict';

app.controller('BrowseController', function($scope, $routeParams, toaster, Idea, Auth, Comment, Join) {

	$scope.searchIdea = '';
	$scope.ideas = Idea.all;

	$scope.user = Auth.user;
	$scope.signedIn = Auth.signedIn;

	$scope.listMode = true;

	if($routeParams.ideaId) {
		var idea = Idea.getIdea($routeParams.ideaId).$asObject();
		$scope.listMode = false;
		setSelectedIdea(idea);
	}

	function setSelectedIdea(idea) {
		$scope.selectedIdea = idea;

		// Check isIdeaCreator only if user is signedIn
		if($scope.signedIn()) {

			// Check if the current user has already joined the idea
			Join.isJoined(idea.$id).then(function(data) {
				$scope.alreadyJoined = data;
			});

			// Check if the current user is the creator of selected idea
			$scope.isIdeaCreator = Idea.isCreator;

			// Check if the selectedIdea is open
			$scope.isOpen = Idea.isOpen;

			// Unblock the Join button on Join modal
			// $scope.join = {close: ''};
			$scope.block = false;

			// Check if the current user is the creator (to display 'leave team' button)
			$scope.isJoinMaker = Join.isMaker;
		}

		// Get list of comments for the selected idea
		$scope.comments = Comment.comments(idea.$id);

		// Get list of team members for the selected idea
		$scope.joins = Join.joins(idea.$id);
	};

	// --------------- idea ---------------

	$scope.cancelIdea = function(ideaId) {
		Idea.cancelIdea(ideaId).then(function() {
			toaster.pop('success', "Idea deleted. :(");
		});

	};

	// --------------- COMMENT ---------------

	$scope.addComment = function() {
		var comment = {
			content: $scope.content,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar
		};

		Comment.addComment($scope.selectedIdea.$id, comment).then(function() {
			$scope.content = '';
		});
	};

	// --------------- Join ---------------

	$scope.makeJoin = function() {
		var join = {
			uid: $scope.user.uid,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar
		};

		Join.makeJoin($scope.selectedIdea.$id, join).then(function() {
			toaster.pop('success', "Awesome! You officially have a team :)");

			// Mark that the current user has joined this team.
			$scope.alreadyJoined = true;

			// Disable the "Join Now" button on the modal
			$scope.block = true;
		});
	};

	$scope.cancelJoin = function(joinId) {
		Join.cancelJoin($scope.selectedIdea.$id, joinId).then(function() {
			toaster.pop('success', "You have been removed from this team.");

			// Mark that the current user has left the team.
			$scope.alreadyJoined = false;

			// Unblock the Join button on Join modal
			$scope.block = false;

		});
	};

});
