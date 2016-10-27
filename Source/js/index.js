/**
 * JavaScript for index.html
 */

var googleUser;

var loginModal = $('#loginModal');

$( document ).ready(function() {
    // disallow closing the login modal manually
    // http://stackoverflow.com/questions/9894339/disallow-twitter-bootstrap-modal-window-from-closing
    $('#loginModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // display the login modal
    loginModal.modal({show:true});
});

function onSignIn(response) {
    console.log("onSignIn function");
    googleUser = response;
    loginModal.modal('hide');
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        loginModal.modal({show:true});
    });
}

angular.module("FlickBlenderApp", []).controller("FlickBlenderController", function($scope) {
    $scope.googleUser = googleUser;
    $scope.message = "This is the home page.";

    $scope.shows = ["Star Trek", "Doctor Who", "Firefly"];
    $scope.episodes = ["Season 1 episode 1", "Season 1 episode 2", "Season 1 episode 3", "Season 1 episode 4"];
    $scope.listClick = function(name) {
        console.log(name + " clicked");
    };
});
