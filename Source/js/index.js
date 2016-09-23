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

function handleLoginModal() {


    if (! googleUser.isSignedIn()) {
        loginModal.style.display = "block";
    }
    else {
        loginModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
    }
}
