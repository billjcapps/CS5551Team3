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
});
