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

.controller("FlickBlenderController", function($scope) {
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


    $scope.episodes = ["Season 1 episode 1", "Season 1 episode 2", "Season 1 episode 3", "Season 1 episode 4"];

    // test data
    $scope.franchises = [];
    $scope.franchises.push(new Franchise("Star Trek"));
    $scope.franchises[0].serieses.push(new Series("The Next Generation"));
    $scope.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 1", new Date(99, 8, 3)));
    $scope.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 2", new Date(99, 8, 10)));
    $scope.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 3", new Date(99, 8, 17)));
    $scope.franchises[0].serieses[0].episodes.push(new Episode("TNG Season 1 episode 4", new Date(99, 8, 24)));
    $scope.franchises[0].serieses.push(new Series("Deep Space Nine"));
    $scope.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 1", new Date(2003, 8, 3)));
    $scope.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 2", new Date(2003, 8, 10)));
    $scope.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 3", new Date(2003, 8, 17)));
    $scope.franchises[0].serieses[1].episodes.push(new Episode("DS9 Season 1 episode 4", new Date(2003, 8, 24)));
    $scope.franchises[0].serieses.push(new Series("Voyager"));
    $scope.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 1", new Date(2005, 8, 3)));
    $scope.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 2", new Date(2005, 8, 10)));
    $scope.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 3", new Date(2005, 8, 17)));
    $scope.franchises[0].serieses[2].episodes.push(new Episode("Voyager Season 1 episode 4", new Date(2005, 8, 24)));
    $scope.franchises.push(new Franchise("Doctor Who"));
    $scope.franchises[1].serieses.push(new Series("Classic"));
    $scope.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 1", new Date(99, 9, 3)));
    $scope.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 2", new Date(99, 9, 10)));
    $scope.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 3", new Date(99, 9, 17)));
    $scope.franchises[1].serieses[0].episodes.push(new Episode("Who Season 1 episode 4", new Date(99, 9, 24)));
    $scope.franchises[1].serieses.push(new Series("New"));
    $scope.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 1", new Date(2003, 9, 3)));
    $scope.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 2", new Date(2003, 9, 10)));
    $scope.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 3", new Date(2003, 9, 17)));
    $scope.franchises[1].serieses[1].episodes.push(new Episode("New Who Season 1 episode 4", new Date(2003, 9, 24)));
    $scope.franchises.push(new Franchise("Firefly"));
    $scope.franchises[2].serieses.push(new Series("TV"));
    $scope.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 1", new Date(2002, 9, 3)));
    $scope.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 2", new Date(2002, 9, 10)));
    $scope.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 3", new Date(2002, 9, 17)));
    $scope.franchises[2].serieses[0].episodes.push(new Episode("FF Season 1 episode 4", new Date(2002, 9, 24)));
    $scope.franchises[2].serieses.push(new Series("Serenity"));
    $scope.franchises[2].serieses[1].episodes.push(new Episode("Serenity", new Date(2005, 7, 3)));

    $scope.lastFranchiseClicked = -1;  // second click toggles hiding of serieses
    $scope.thisFranchiseHidden = $scope.franchises.map(function() {return true;});  // a true for each franchise

    $scope.franchiseListClick = function(franchiseIndexClicked) {
        console.log($scope.franchises[franchiseIndexClicked].name + " franchise clicked");
        if (franchiseIndexClicked === $scope.lastFranchiseClicked) {
            // toggle hidden
            $scope.thisFranchiseHidden[franchiseIndexClicked] = !$scope.thisFranchiseHidden[franchiseIndexClicked]
        }
        else {  // first click on this franchise
            $scope.lastFranchiseClicked = franchiseIndexClicked;
        }

        // TODO: show the blended episode list for this franchise
        $scope.currentEpisodeList = [{name: "this will be the blended " +
                                            $scope.franchises[franchiseIndexClicked].name +
                                            " episode list"}];
    };

    $scope.seriesListClick = function(franchiseIndexClicked, seriesIndexClicked) {
        $scope.currentEpisodeList = $scope.franchises[franchiseIndexClicked].serieses[seriesIndexClicked].episodes;
    };

    $scope.episodeListClick = function(clickedObject) {
        // TODO:
        console.log(clickedObject);
    }
})

.controller('searchCtrl', function($scope, $http) {
    $scope.showName = "";
    $scope.getShow = function() {

        $http.get("https://api.themoviedb.org/3/search/multi?query=" + $scope.showName + "&api_key=2f4c29e5d9bbf6c3e34220d46d0595b0")

            .then(function(response) {
                $scope.movies = response.data.results
            }, function(response) {
                console.log("error response from api");
                console.log(response);
                $scope.movies= [];
            });
    };
});
