/**
 * JavaScript for index.html
 */

function Franchise(_name) {
    this.name = _name;
    this.serieses = [];
}

function Series(_name) {
    this.name = _name;
    this.episodes = [];
}

function Episode(_name, _airDate) {
    this.name = _name;
    this.airDate = _airDate;
}

var loginModal = $('#loginModal');

$( document ).ready(function() {
    // disallow closing the login modal manually
    // http://stackoverflow.com/questions/9894339/disallow-twitter-bootstrap-modal-window-from-closing
    $('#loginModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // display the login modal
    loginModal.modal('show');
});

angular.module("FlickBlenderApp", [])

// for sharing information between controllers about which franchise we are working with
.factory("workingFranchise", function() {
    var data = {
        index: -1,
        searchText: ""
    };
    return data;
})

.factory("userData", function() {
    var data = {franchises: []};

    // test data
    data.franchises.push(new Franchise("Star Trek"));
    data.franchises[0].serieses.push(new Series("The Next Generation"));
    data.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 1", new Date(99, 8, 3)));
    data.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 2", new Date(99, 8, 10)));
    data.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 3", new Date(99, 8, 17)));
    data.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 4", new Date(99, 8, 24)));
    data.franchises[0].serieses.push(new Series("Deep Space Nine"));
    data.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 1", new Date(2003, 8, 3)));
    data.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 2", new Date(2003, 8, 10)));
    data.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 3", new Date(2003, 8, 17)));
    data.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 4", new Date(2003, 8, 24)));
    data.franchises[0].serieses.push(new Series("Voyager"));
    data.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 1", new Date(2005, 8, 3)));
    data.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 2", new Date(2005, 8, 10)));
    data.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 3", new Date(2005, 8, 17)));
    data.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 4", new Date(2005, 8, 24)));
    data.franchises.push(new Franchise("Doctor Who"));
    data.franchises[1].serieses.push(new Series("Classic"));
    data.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 1", new Date(99, 9, 3)));
    data.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 2", new Date(99, 9, 10)));
    data.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 3", new Date(99, 9, 17)));
    data.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 4", new Date(99, 9, 24)));
    data.franchises[1].serieses.push(new Series("New"));
    data.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 1", new Date(2003, 9, 3)));
    data.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 2", new Date(2003, 9, 10)));
    data.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 3", new Date(2003, 9, 17)));
    data.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 4", new Date(2003, 9, 24)));
    data.franchises.push(new Franchise("Firefly"));
    data.franchises[2].serieses.push(new Series("TV"));
    data.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 1", new Date(2002, 9, 3)));
    data.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 2", new Date(2002, 9, 10)));
    data.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 3", new Date(2002, 9, 17)));
    data.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 4", new Date(2002, 9, 24)));
    data.franchises[2].serieses.push(new Series("Serenity"));
    data.franchises[2].serieses[1].episodes.push(new Episode("Serenity", new Date(2005, 7, 3)));

    data.addFranchise = function(newFranchiseName) {
        data.franchises.push(new Franchise(newFranchiseName));
    };

    return data;
})

.controller("FlickBlenderController", function($scope, userData, workingFranchise) {
    // google OAth stuff
    function onSignIn(response) {
        console.log("onSignIn function");
        $scope.googleUser = response;
        $scope.googleProfile = response.getBasicProfile();
        loginModal.modal('hide');
        $scope.$digest();
    }
    window.onSignIn = onSignIn;
    $scope.signOut = function() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            $scope.googleProfile = null;  // remove the profile from the scope
            $scope.$digest();
            loginModal.modal('show');
        });
    };


    $scope.userData = userData;

    $scope.lastFranchiseClicked = -1;  // second click toggles hiding of serieses
    $scope.thisFranchiseHidden = userData.franchises.map(function() {return true;});  // a true for each franchise

    $scope.franchiseListClick = function(franchiseIndexClicked) {
        console.log(userData.franchises[franchiseIndexClicked].name + " franchise clicked");
        if (franchiseIndexClicked === $scope.lastFranchiseClicked) {
            // toggle hidden
            $scope.thisFranchiseHidden[franchiseIndexClicked] = !$scope.thisFranchiseHidden[franchiseIndexClicked]
        }
        else {  // first click on this franchise
            $scope.lastFranchiseClicked = franchiseIndexClicked;
        }

        // TODO: show the blended episode list for this franchise
        $scope.currentEpisodeList = [{name: "this will be the blended " +
                                            userData.franchises[franchiseIndexClicked].name +
                                            " episode list"}];
    };

    $scope.addSeriesClick = function(franchiseIndex) {
        workingFranchise.index = franchiseIndex;
        workingFranchise.searchText = userData.franchises[franchiseIndex].name;
        console.log(workingFranchise.searchText);
    };

    $scope.seriesListClick = function(franchiseIndexClicked, seriesIndexClicked) {
        $scope.currentEpisodeList = userData.franchises[franchiseIndexClicked].serieses[seriesIndexClicked].episodes;
    };

    $scope.episodeListClick = function(clickedObject) {
        // TODO:
        console.log(clickedObject);
    }
})

.controller('searchCtrl', function($scope, $http, userData, workingFranchise) {
    $scope.searchResults = [];
    $scope.workingFranchise = workingFranchise;

    $scope.getShow = function() {
        $http.get("https://api.themoviedb.org/3/search/multi?query=" +
                  workingFranchise.searchText +
                  "&api_key=2f4c29e5d9bbf6c3e34220d46d0595b0")
        .then(function(response) {
            $scope.searchResults = response.data.results
        }, function(response) {
            console.log("error response from api");
            console.log(response);
            $scope.searchResults= [];
        });
    };

    $scope.searchResultClick = function(seriesResultIndex) {
        var seriesResult = $scope.searchResults[seriesResultIndex];
        console.log(seriesResult);
        var id = seriesResult.id;  // TODO: put this in the Series ctor
        var name = seriesResult.original_name;
        if (name === undefined) {
            name = seriesResult.original_title;
        }
        console.log(name);
        userData.franchises[workingFranchise.index].serieses.push(new Series(name));

        // TODO: add episodes for this series
        // TODO: remake blended episode list
        // TODO: show in search results indication that this series was added
    };
})

.controller('newFranchiseCtrl', function($scope, userData) {
    $scope.franchiseName = "";
    $scope.addFranchiseClick = function() {
        console.log("adding " + $scope.franchiseName);
        userData.addFranchise($scope.franchiseName);
        $("#newFranchiseModal").modal('hide');
    }
});
