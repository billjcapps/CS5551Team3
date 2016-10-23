/**
 * JavaScript for index.html
 */

var googleUser;

var loginModal = document.getElementById('loginModal');

function onSignIn(response) {
    console.log("onSignIn function");
    googleUser = response;
    loginModal.style.display = "none";
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        loginModal.style.display = "block";
    });
}

angular.module("FlickBlenderApp", []).controller("FlickBlenderController", function($scope) {
    $scope.message = "This is the home page.";

    $scope.shows = ["Star Trek", "Doctor Who", "Firefly"];
    $scope.episodes = ["Season 1 episode 1", "Season 1 episode 2", "Season 1 episode 3", "Season 1 episode 4"];
    $scope.listClick = function(name) {
        console.log(name + " clicked");
    };
});
