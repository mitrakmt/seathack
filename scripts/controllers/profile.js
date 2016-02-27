'use strict';

app.controller('ProfileController', function($scope, Profile, Auth) {

	$scope.ideaRunner = [];
	$scope.ideaPoster = [];

	var uid = Auth.user.uid;

	Profile.getIdeasForUser(uid).then(function(ideas) {

		for(var i = 0; i < ideas.length; i++) {
			ideas[i].type? $scope.ideaPoster.push(ideas[i]) : $scope.ideaRunner.push(ideas[i])
		}

		$scope.numPoster = $scope.ideaPoster.length;
		$scope.numRunner = $scope.ideaRunner.length;

	})

	Profile.getJoinsForUser(uid).then(function(joins) {

		for(var i = 0; i < joins.length; i++) {
			joins[i].type? $scope.ideaPoster.push(joins[i]) : $scope.ideaRunner.push(joins[i])
		}

		$scope.numPoster = $scope.ideaPoster.length;
		$scope.numRunner = $scope.ideaRunner.length;

	});

});
