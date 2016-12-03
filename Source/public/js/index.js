/**
 * JavaScript for index.html
 */

// search data API
const MAIN_API_ADDRESS = "https://api.themoviedb.org/3";
const API_KEY = "api_key=2f4c29e5d9bbf6c3e34220d46d0595b0";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// user data APIs
const SAVE_URL = "/save";
const LOAD_URL = "/load";

// data structures
/**
 * Franchise constructor
 * @param {(string|object)} _arg name of franchise or raw franchise object
 * @constructor
 */
function Franchise(_arg) {
    if (typeof _arg == "string") {
        this.name = _arg;
        this.serieses = [];
        this.blended = [];
    }
    else {  // object
        console.log("in franchise ctor with:");
        console.log(_arg);

        this.name = _arg.name;
        this.blended = [];
        this.serieses = [];

        var _this = this;  // to use it inside a different function

        angular.forEach(_arg.serieses, function(series) {
            _this.addSeries(series);
        });

        this.remakeBlendedEpisodeList();
    }
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
Franchise.prototype.remakeBlendedEpisodeList = function () {
    // note: this relies on the series episode lists being sorted

    // like the merge part of merge sort
    this.blended = [];
    var seriesesNotDoneCount = 0;
    var FLAG_FOR_NO_NONEMPTY_LIST_FOUND = this.serieses.length + 1;
    var firstNonEmptyEpisodeList = FLAG_FOR_NO_NONEMPTY_LIST_FOUND;
    var earliestEpisodeIndex;  // this variable will hold which series it comes from
    var i;  // iterating index

    var cursors = [];  // cursors for episodes
    for (i = 0; i < this.serieses.length; ++i) {
        if (this.serieses[i].episodes.length > 0) {
            if (firstNonEmptyEpisodeList == FLAG_FOR_NO_NONEMPTY_LIST_FOUND) {
                firstNonEmptyEpisodeList = i;
            }
            ++seriesesNotDoneCount;
            cursors.push(0);
        }
        else {
            cursors.push(-1);
        }
    }

    while(seriesesNotDoneCount > 0) {
        earliestEpisodeIndex = firstNonEmptyEpisodeList;
        // start by assuming that the first non-ended list has the earliest date
        for (i = earliestEpisodeIndex + 1; i < cursors.length; ++i) {
            // i is index in serieses and in cursors to compare with earliestEpisodeIndex index in the same
            if (cursors[i] > -1) {
                // console.log("cursors length " + cursors.length + "  i " + i);
                // this cursor hasn't finished its list yet
                if (this.serieses[i].episodes[cursors[i]].airDate <
                    this.serieses[earliestEpisodeIndex].episodes[cursors[earliestEpisodeIndex]].airDate)
                {
                    earliestEpisodeIndex = i;
                }
            }
        }
        // now we have the earliest date that we want to push to the blended list
        this.blended.push(this.serieses[earliestEpisodeIndex].episodes[cursors[earliestEpisodeIndex]]);
        this.blended[this.blended.length - 1].setSeriesAbbreviation(this.serieses[earliestEpisodeIndex].name);
        // advance the cursor
        ++cursors[earliestEpisodeIndex];
        // see if this cursor has reach the end of its list
        if (cursors[earliestEpisodeIndex] >= this.serieses[earliestEpisodeIndex].episodes.length) {
            // end of the list
            cursors[earliestEpisodeIndex] = -1;
            // finished one of the lists
            --seriesesNotDoneCount;
            // was that the first non-ended list?
            if (earliestEpisodeIndex == firstNonEmptyEpisodeList) {
                // then move it to the next non-ended list
                while (firstNonEmptyEpisodeList < cursors.length && cursors[firstNonEmptyEpisodeList] == -1) {
                    ++firstNonEmptyEpisodeList;
                }
            }
        }
    }
};

/**
 * Series constructor
 * @param {(string|object)} _arg name of series or raw series object
 * @param {number} [_id] ID number of series, given by API
 * @constructor
 */
function Series(_arg, _id) {
    if (typeof _arg == "string") {
        this.name = _arg;
        this.id = _id;
        this.episodes = [];
    }
    else {  // raw object
        this.name = _arg.name;
        this.id = _arg.id;
        this.episodes = [];

        var unsortedEpisodeList = [];

        angular.forEach(_arg.episodes, function(episode) {
            unsortedEpisodeList.push(new Episode(episode));
        });

        this.sortAndSetEpisodes(unsortedEpisodeList);
    }
}
Series.prototype.sortAndSetEpisodes = function (unsortedEpisodeList) {
    console.log("called set and sort function - length " + unsortedEpisodeList.length);
    this.episodes = unsortedEpisodeList;
    this.episodes.sort(function(a, b) {
        /*  test done with Encounter at Farpoint
        if (a.name[0] == 'E' && a.name[1] == 'n' && b.name[0] == 'E' && b.name[1] == 'n') {
            console.log("comparing: ");
            console.log(a.name);
            console.log(a.airDate);
            console.log(b.name);
            console.log(b.airDate);
        }
        */
        if (a.airDate < b.airDate) {
            return -1;
        }
        if (a.airDate > b.airDate) {
            return 1;
        }
        // if same date, alphabetical order
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
};

/**
 *  if movie, pass 0 as season number
 * @param _name
 * @param _airDate
 * @param _seasonNumber if movie, pass 0
 * @param _episodeNumber
 * @param _overview
 * @param _imgPath
 * @constructor
 */
function Episode(_name, _airDate, _seasonNumber, _episodeNumber, _overview, _imgPath) {
    if (typeof _name == "string") {
        // console.log("constructing episode " + _name + " with date " + _airDate);
        this.name = _name;
        this.airDate = _airDate;
        this.seasonNumber = _seasonNumber;
        this.episodeNumber = _episodeNumber;
        this.overview = _overview;
        this.imgPath = _imgPath;
        this.seriesAbbreviation = "";  // this is only set when blending
        this.watched = false;
    }
    else {  // raw episode object
        this.name = _name.name;
        this.airDate = new Date(_name.airDate);
        this.seasonNumber = _name.seasonNumber;
        this.episodeNumber = _name.episodeNumber;
        this.overview = _name.overview;
        this.imgPath = _name.imgPath;
        this.seriesAbbreviation = "";  // this is only set when blending
        this.watched = _name.watched;
    }
}
Episode.MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
Episode.prototype.getSeasonEpisodeString = function() {
    if (this.seasonNumber == 0) {  // movie
        return "";
    }

    // not a movie
    var toReturn = "S";
    if (this.seasonNumber < 10) {
        toReturn += "0";
    }
    toReturn += this.seasonNumber + "E";
    if (this.episodeNumber < 10) {
        toReturn += "0";
    }
    toReturn += this.episodeNumber + " ";

    return toReturn;
};
Episode.prototype.getDateString = function() {
    if (this.airDate && this.airDate.getUTCFullYear()) {
        return this.airDate.getUTCFullYear() + " " +
               Episode.MONTHS[this.airDate.getUTCMonth()] + " " +
               this.airDate.getUTCDate();
    }
    return "";
};
Episode.prototype.setSeriesAbbreviation = function(seriesName) {
    if (this.seasonNumber == 0) {  // movie
        this.seriesAbbreviation = "";
        return;
    }

    // not a movie
    var words = seriesName.split(' ');
    var buildAbbreviation = "";
    angular.forEach(words, function(word) {
        buildAbbreviation += word[0];
    });
    buildAbbreviation += " ";

    this.seriesAbbreviation = buildAbbreviation;
};
Episode.prototype.getImgPath = function() {
    if (this.imgPath) {
        return IMG_URL + this.imgPath;
    }
    return "img/Logo.png";
};

var loginModal = $('#loginModal');

$( document ).ready(function() {
    // disallow closing the login modal manually
    // http://stackoverflow.com/questions/9894339/disallow-twitter-bootstrap-modal-window-from-closing
    $('#loginModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // focus text input when modal shows
    // modal has id: string + 'Modal'
    // input has id: string + 'Input'
    angular.forEach([
        'search',
        'newFranchise'
    ], function(idModalInput) {
        $('#' + idModalInput + 'Modal').on('shown.bs.modal', function() {
            console.log("shown modal event");
            $('#' + idModalInput + 'Input').focus();
        });
    });

    // enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // don't scroll window when clicking on some links
    $('.no-move').click(function(event){
        event.preventDefault();
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

.factory("auth", function() {
    // google OAuth stuff
    var signInCallbacks = [];

    var authInterface = {
        googleUser: null,
        googleProfile: null
    };

    authInterface.signInNotify = function(callback) {
        signInCallbacks.push(callback);
    };

    function onSignIn(response) {
        console.log("onSignIn function");
        authInterface.googleUser = response;
        authInterface.googleProfile = response.getBasicProfile();

        // call all notify callbacks
        // (one callback is userData to to load the data from database,
        // another callback is main controller to display the username)
        angular.forEach(signInCallbacks, function(callback) {
            callback();
        });

        loginModal.modal('hide');
    }
    window.onSignIn = onSignIn;

    authInterface.signOut = function() {

        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            authInterface.googleProfile = null;  // remove the profile from the scope
            loginModal.modal('show');
        });
    };

    return authInterface;
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
                        seasonAPICalls.addToEpisodeList(new Episode(episode.name,
                                                                    convertDate(episode.air_date),
                                                                    episode.season_number,
                                                                    episode.episode_number,
                                                                    episode.overview,
                                                                    episode.still_path));
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

.factory("userData", function($http, seasonAPICalls, getEpisodeListService, $timeout, auth) {
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
        data.save();
    };

    data.deleteFranchise = function(franchiseIndex) {
        data.franchises.splice(franchiseIndex, 1);
        data.save();
    };

    data.addSeries = function(seriesResult, workingFranchise) {
        var id = seriesResult.id;
        var name = seriesResult.original_name;
        if (name === undefined) {
            name = seriesResult.original_title;
        }
        console.log(name);

        // save watched status if series already exists
        var listOfWatchedEpisodes = [];
        if (data.franchises[workingFranchise.index].hasSeries(id)) {
            var thisSeries = data.franchises[workingFranchise.index].getSeriesById(id);
            angular.forEach(thisSeries.episodes, function(episode) {
                if (episode.watched) {
                    listOfWatchedEpisodes.push(episode.seasonNumber * 1000 + episode.episodeNumber);
                }
            });
        }
        function reapplyWatchedEpisodes(listOfWatchedEpisodes) {
            var thisSeries = data.franchises[workingFranchise.index].getSeriesById(id);
            angular.forEach(listOfWatchedEpisodes, function(episodeCode) {
                for (var i = 0; i < thisSeries.episodes.length; ++i) {
                    if ((thisSeries.episodes[i].seasonNumber * 1000 + thisSeries.episodes[i].episodeNumber) == episodeCode) {
                        thisSeries.episodes[i].watched = true;
                        break;
                    }
                }
            });
        }

        data.franchises[workingFranchise.index].addSeries(name, id);

        // add episodes (or update episode list) for this series

        if (seriesResult.media_type == "movie") {
            // console.log(seriesResult);
            // to signal that it is a movie, seasonNumber is set to 0
            data.franchises[workingFranchise.index].getSeriesById(id).episodes = [
                new Episode(name,
                    convertDate(seriesResult.release_date),
                    0,
                    0,
                    seriesResult.overview,
                    seriesResult.backdrop_path)
            ];
            reapplyWatchedEpisodes(listOfWatchedEpisodes);

            data.franchises[workingFranchise.index].remakeBlendedEpisodeList();

            return data.save();
        }

        // get number of seasons
        $http.get(MAIN_API_ADDRESS + "/tv/" + id + "?" + API_KEY).then(function(response) {
            var seasonCount = response.data.number_of_seasons;
            // prepare set of urls to call
            seasonAPICalls.clearUrls();
            for (var i = seasonCount; i > 0; --i) {
                seasonAPICalls.addUrl(id, i);
            }
            // call those urls
            // console.log("calling getEpisodes now...");
            getEpisodeListService.getEpisodes(function() {
                $timeout(function() {  // timeout to give time to update userdata
                    // console.log("this is what getEpisodes gave me: ");
                    // console.log(seasonAPICalls.getEpisodeList());

                    // put episode list in userData
                    data.franchises[workingFranchise.index]
                        .getSeriesById(id)
                        .sortAndSetEpisodes(seasonAPICalls.getEpisodeList());
                    reapplyWatchedEpisodes(listOfWatchedEpisodes);

                    data.franchises[workingFranchise.index].remakeBlendedEpisodeList();

                    data.save();
                }, 1100);
            });
        });
    };

    data.deleteSeries = function(franchiseIndex, seriesIndex) {
        data.franchises[franchiseIndex].serieses.splice(seriesIndex, 1);
        data.franchises[franchiseIndex].remakeBlendedEpisodeList();

        data.save();
    };

    // remote data
    data.save = function() {
        console.log(auth.googleUser);
        console.log(auth.googleProfile);
        $http.post(SAVE_URL, {
            id: "google" + auth.googleProfile.getId(),  // if other auth methods are implemented, put a different code before id
            data: { franchises: data.franchises }
        }).then(function(response) {
            console.log("response for data save: " + response);
        });
    };

    data.load = function() {
        console.log("load not implemented - loading blank data");
        data.franchises.length = 0;
        $http.post(LOAD_URL, {
            id: "google" + auth.googleProfile.getId()  // if other auth methods are implemented, put a different code before id
        }).then(function(response) {
            console.log("load response:");
            console.log(response);

            angular.forEach(response.data.franchises, function(franchise) {
                data.franchises.push(new Franchise(franchise));
            });
            // notify controller that it's loaded? apparently not needed
        });
    };

    auth.signInNotify(function() {
        data.load();
    });

    return data;
})

.controller("FlickBlenderController", function($scope, auth, userData, workingFranchise) {
    auth.signInNotify(function() {
        $scope.googleProfile = auth.googleProfile;
        $scope.$apply();
    });
    $scope.signOut = function() {
        auth.signOut();
        $scope.googleProfile = null;
    };

    $scope.userData = { franchises: userData.franchises };

    $scope.lastFranchiseClicked = -1;  // second click toggles hiding of serieses
    $scope.thisFranchiseHidden = userData.franchises.map(function() {return true;});  // a true for each franchise

    $scope.hideWatched = false;

    $scope.focusEpisode = new Episode({});

    $scope.franchiseListClick = function(franchiseIndexClicked) {
        console.log(userData.franchises[franchiseIndexClicked].name + " franchise clicked");
        if (franchiseIndexClicked === $scope.lastFranchiseClicked) {
            // toggle hidden
            $scope.thisFranchiseHidden[franchiseIndexClicked] = !$scope.thisFranchiseHidden[franchiseIndexClicked]
        }
        else {  // first click on this franchise
            $scope.lastFranchiseClicked = franchiseIndexClicked;
        }

        $scope.currentEpisodeList = userData.franchises[franchiseIndexClicked].blended;
        $scope.listIsNotBlended = false;
    };

    $scope.addSeriesClick = function(franchiseIndex) {
        workingFranchise.index = franchiseIndex;
        workingFranchise.searchText = userData.franchises[franchiseIndex].name;
        console.log(workingFranchise.searchText);
    };

    $scope.deleteFranchiseClick = function(franchiseIndex) {
        if (confirm("Are you sure you want to remove this franchise?\n" + userData.franchises[franchiseIndex].name)) {
            userData.deleteFranchise(franchiseIndex);
        }
    };

    $scope.seriesListClick = function(franchiseIndexClicked, seriesIndexClicked) {
        $scope.currentEpisodeList = userData.franchises[franchiseIndexClicked].serieses[seriesIndexClicked].episodes;
        $scope.lastFranchiseClicked = -1;
        $scope.listIsNotBlended = true;
    };

    $scope.deleteSeriesClick = function(franchiseIndexClicked, seriesIndexClicked) {
        if (confirm("Are you sure you want to remove this series/movie?\n" +
                    userData.franchises[franchiseIndexClicked].serieses[seriesIndexClicked].name)) {
            userData.deleteSeries(franchiseIndexClicked, seriesIndexClicked);
        }
    };

    $scope.episodeListClick = function(clickedIndex) {
        $scope.focusEpisode = $scope.currentEpisodeList[clickedIndex];
        if ($(window).width() < 768){
            $('#episodeDetails')[0].scrollIntoView(true);
        }
    };

    $scope.toggleWatchedClick = function(index) {
        $scope.currentEpisodeList[index].watched = ! $scope.currentEpisodeList[index].watched;
        userData.save();
    };

    $scope.toggleHideWatchedClick = function() {
        $scope.hideWatched = ! $scope.hideWatched;
    };

    $scope.toggleFocusWatchedClick = function() {
        $scope.focusEpisode.watched = ! $scope.focusEpisode.watched;
    };
})

.controller('searchCtrl', function($scope, $http, $timeout, userData, workingFranchise) {
    $scope.searchResults = [];
    $scope.workingFranchise = workingFranchise;

    $scope.searchButtonClick = function() {
        console.log("clicked search button working with franchise " +
                    userData.franchises[workingFranchise.index].name);
        $http.get(MAIN_API_ADDRESS + "/search/multi?query=" +
                  workingFranchise.searchText + "&" + API_KEY)
        .then(function(response) {
            // TODO: tell user if zero search results
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

        userData.addSeries(seriesResult, workingFranchise);

        // TODO: tell the user that this is how you update the episode list
        // (click on the series in the search results)
        // (or make a different way of updating it)
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
