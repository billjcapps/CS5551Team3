/**
 * JavaScript for index.html
 */

var MAIN_API_ADDRESS = "https://api.themoviedb.org/3";
var API_KEY = "api_key=2f4c29e5d9bbf6c3e34220d46d0595b0";

// data structures
function Franchise(_name) {
    this.name = _name;
    this.serieses = [];
}
Franchise.prototype.addSeries = function(name, id) {
    // check for already present
    if (! this.hasSeries(id)) {
        this.serieses.push(new Series(name, id));
    }
};
Franchise.prototype.hasSeries = function(id) {
    // console.log("checking if " + this.name + " Franchise has id " + id);
    for (var i = 0; i < this.serieses.length; ++i) {
        if (this.serieses[i].id == id) {
            return true;
        }
    }
    return false;
};
Franchise.prototype.getSeriesById = function(id) {
    for (var i = 0; i < this.serieses.length; ++i) {
        if (this.serieses[i].id == id) {
            return this.serieses[i];
        }
    }
    return null;
};

function Series(_name, _id) {
    this.name = _name;
    this.id = _id;
    this.episodes = [];
}

function Episode(_name, _airDate) {
    // console.log("constructing episode " + _name + " with date " + _airDate);
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

// enter-press attribute on html element to execute a function when enter is pressed
.directive("enterPress", function() {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.enterPress);
                });

                event.preventDefault();
            }
        });
    };
})

// for sharing information between controllers about which franchise we are working with
.factory("workingFranchise", function() {
    return {
        index: -1,
        searchText: ""
    };
})

// all of the season API urls needed to get all the episodes
.factory('seasonAPICalls', function() {
    var _urls = [];
    var _responseEpisodeList = [];  // also provides a storage place for the response

    return {
        addUrl: function(tvShowId, seasonNumber) {
            _urls.push(MAIN_API_ADDRESS + "/tv/" + tvShowId + "/season/" + seasonNumber + "?" + API_KEY)
        },
        getUrls: function() { return _urls; },
        clearUrls: function () { _urls = []; },

        clearEpisodeList: function() { _responseEpisodeList = []; },
        addToEpisodeList: function(episode) {
            _responseEpisodeList.push(episode)
        },
        getEpisodeList: function() { return _responseEpisodeList; }
    };
})

// make all the api calls to get all the episodes for a series
// http://stackoverflow.com/questions/23560570/javascript-angular-how-to-chain-unknown-number-of-promises
// precondition: fill seasonAPICalls
.factory('getEpisodeListService', function($http, $q, seasonAPICalls){
    var promises = [];

    var updatePromises = function() {
        promises = [];
        seasonAPICalls.clearEpisodeList();
        angular.forEach(seasonAPICalls.getUrls(), function(url){
            promises.push(
                $http({ method: 'GET', url: url }).then(function(seasonInfo){
                    // console.log("got this seasonInfo from api:");
                    // console.log(seasonInfo);
                    angular.forEach(seasonInfo.data.episodes, function(episode) {
                        // console.log("found this episode in seasonInfo:");
                        // console.log(episode);
                        // TODO: get more info about episode
                        seasonAPICalls.addToEpisodeList(new Episode(episode.name, convertDate(episode.air_date)));
                    });
                    // console.log("promise should now be resolved for: " + url);
                })
            );
        });
        // console.log("length of promises is now: " + promises.length);
    };

    return {
        getEpisodes: function(callback) {
            updatePromises();
            $q.all(promises).then(callback());  /* function() {
                console.log("in the factory object function");  // this never happens
                return seasonAPICalls.getEpisodeList();
            })*/
        }
    };
})

.factory("userData", function() {
    var data = {franchises: []};

    /*
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
    */

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
        $scope.lastFranchiseClicked = -1;
    };

    $scope.episodeListClick = function(clickedObject) {
        // TODO: episode click
        console.log(clickedObject);
    }
})

.controller('searchCtrl', function($scope, $http, userData, workingFranchise, seasonAPICalls, getEpisodeListService) {
    $scope.searchResults = [];
    $scope.workingFranchise = workingFranchise;

    $scope.searchButtonClick = function() {
        console.log("clicked search button working with franchise " +
                    userData.franchises[workingFranchise.index].name);
        $http.get(MAIN_API_ADDRESS + "/search/multi?query=" +
                  workingFranchise.searchText + "&" + API_KEY)
        .then(function(response) {
            $scope.searchResults = response.data.results;
            $scope.added = function(id) {
                return userData.franchises[workingFranchise.index].hasSeries(id);  // function with id parameter
            };
        }, function(response) {
            console.log("error response from api");
            console.log(response);
            $scope.searchResults= [];
        });
    };

    $scope.searchResultClick = function(seriesResultIndex) {
        // TODO: show user an indication that this series is in the process of being added (it might take a few seconds)

        var seriesResult = $scope.searchResults[seriesResultIndex];
        console.log(seriesResult);

        var id = seriesResult.id;
        var name = seriesResult.original_name;
        if (name === undefined) {
            name = seriesResult.original_title;
        }
        console.log(name);
        userData.franchises[workingFranchise.index].addSeries(name, id);

        if (seriesResult.media_type == "movie") {
            userData.franchises[workingFranchise.index].getSeriesById(id).episodes = [
                new Episode(name, convertDate(seriesResult.release_date))
            ];

            // TODO: remake blended episode list

            // show in search results indication that this series was added
            // $scope.$digest();

            return;
        }

        // add episodes (or update episode list) for this series

        // TODO: tell the user that this is how you update the episode list
        // (click on the series in the search results)
        // (or make a different way of updating it)

        // get number of seasons
        $http.get(MAIN_API_ADDRESS + "/tv/" + id + "?" + API_KEY)
        .then(function(response) {
            var seasonCount = response.data.number_of_seasons;
            // prepare set of urls to call
            seasonAPICalls.clearUrls();
            for (var i = seasonCount; i > 0; --i) {
                seasonAPICalls.addUrl(id, i);
            }
            // call those urls
            console.log("calling getEpisodes now...");
            getEpisodeListService.getEpisodes(function() {
                console.log("this is what getEpisodes gave me: ");
                console.log(seasonAPICalls.getEpisodeList());
                // TODO: sort this list by air date
                // put episode list in userData
                userData.franchises[workingFranchise.index].getSeriesById(id).episodes = seasonAPICalls.getEpisodeList();

                // TODO: remake blended episode list

                // show in search results indication that this series was added
                // $scope.$digest();
            });
        });
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

/**
 * convert date from moviedb format to javascript Date
 * @param dateStringFromAPI
 * @returns {Date}
 */
var convertDate = function(dateStringFromAPI) {
    var dateInfo = dateStringFromAPI.split('-');
    return new Date(dateInfo[0], parseInt(dateInfo[1]) - 1, dateInfo[2]);
};
