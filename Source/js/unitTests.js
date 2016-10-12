/**
 * unit tests for javascript functionality
 *
 * open developer console
 * refresh web page
 * "allTests();" in developer console
 */

function assertEqual(comment, actual, expected) {
    if (actual === expected) {
        console.log("PASS: " + comment + ", " + actual + ", " + expected);
    }
    else {
        console.log("FAIL: " + comment + ", " + actual + ", " + expected);
    }
}

console.log("defining allTests");
function allTests() {
    assertEqual("if signed in, no modal",
        (Boolean(googleUser) && googleUser.isSignedIn()),
        loginModal.style.display === "none");
    assertEqual("if not signed in, display modal",
        ((!(googleUser)) || !(googleUser.isSignedIn())),
        (loginModal.style.display === "block") || (loginModal.style.display === ""));
}
