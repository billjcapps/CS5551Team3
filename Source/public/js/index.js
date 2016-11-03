/**
 * JavaScript for index.html
 */

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

    $scope.shows = ["Star Trek", "Doctor Who", "Firefly"];
    $scope.episodes = ["Season 1 episode 1", "Season 1 episode 2", "Season 1 episode 3", "Season 1 episode 4"];
    $scope.listClick = function(name) {
        console.log(name + " clicked");

    };
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
