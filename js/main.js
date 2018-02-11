


var favorites = (function () {
    var currentFavorites = database.getFavorites();
    var $ulFavorites = $("#ul-fav-cities");
    var $anchorList = $(".fav-citites-list");
    var elementTemplate = function (place) {
        var str = "<a class='fav-cities-list' href='#'><li>" + place + "</li><span class='cross'><i class='fa fa-times' aria-hidden='true'></i></span></a>"
        return str;
    }

    function _checkForExistingCity(city) {
        for (let i = 0; i < currentFavorites.length; i += 1) {
            if (currentFavorites[i] === city) {
                return true;
            }
        }
        return false;
    }

    var render = function (city) {
        var placeHolder = "";
        if (typeof currentFavorites === "string") {
            currentFavorites = JSON.parse(currentFavorites);
        }
        if (!city) {
            for (let i = 0; i < currentFavorites.length; i += 1) {
                placeHolder = elementTemplate(currentFavorites[i]);

                $ulFavorites.append(placeHolder);
            }
        } else {
            placeHolder = elementTemplate(city);
            $ulFavorites.append(placeHolder);
        }
    };

    function addCity() {
        var $cityName = $(".city-name").text();
        if (!_checkForExistingCity($cityName)) {
            render($cityName);
            currentFavorites.push($cityName);
            localStorage.setItem("favorites", JSON.stringify(currentFavorites));
        } else {
            DOM.displayError("City has already been added!")
        }
    }

    function deleteCity(event) {
        var $cityName = $(this).prev().text();
        $(this).parent().css("display", "none");

        for (let i = 0; i < currentFavorites.length; i += 1) {
            if (currentFavorites[i] === $cityName) {
                currentFavorites.splice(i, 1);
                break;
            }
        }

        localStorage.setItem("favorites", JSON.stringify(currentFavorites));
        event.stopPropagation();
    }
    return {
        addCity,
        deleteCity,
        render,
    }
})();


var app = (function () {
    var unit = "metric";
    var currentCity = "";

    var boot = function (unit) {
        update("London", unit)
        database.getWeatherInfoByLoc(unit, DOM.displayData, function () {});
        currentCity = DOM.currentCityName;
        favorites.render();
    }

    var update = function (cityName, unit) {
        let cityObj = {
            city: cityName
        };
        database.getWeatherInfo(cityObj, unit, DOM.displayData, function() {
            DOM.displayError("No results found. :(");
        });
        currentCity = cityName;
    };

    var bindEvents = function () {
        //search functionality
        $(".button").on('click', function (e) {
            var value = $(".search").val();
            e.preventDefault();
            if (value.length) {
                var value = $(".search").val();
                update(value, unit)
            } else {
                DOM.displayError("Please fill out the search field!")
            }
        });

        // autocomplete functionality to the search bar
        $(".search").autocomplete({
            source: function (request, response) {
                var matches = $.map(database.citiesList, function (acItem) {
                    if (acItem.toUpperCase().indexOf(request.term.toUpperCase()) ===
                        0) {
                        return acItem;
                    }
                });
                response(matches);
            },
            select: function (event, ui) {
                update(ui.item.value, unit);
            }
        });

        //toggle between measurement unit C/F
        $('#toggle').change(function () {
            if ($(this).prop('checked')) {
                setUnit("metric")
            } else {
                setUnit("imperial")
            }
            update(currentCity, unit, false);
        });

        //add favorite city
        $("#add-city").on("click", favorites.addCity);

        //delete favorite city
        $(document).on("click", ".cross", favorites.deleteCity);

        //update page when clicking on a city from the list
        $(document).on("click", ".fav-cities-list", function (e) {
            var cityToDisplay = $(this).children("li").text();
            update(cityToDisplay, unit);
        });


    }

    var setUnit = function (newUnit) {
        unit = newUnit;
    }

    var init = function () {
        bindEvents();
        boot();
    }

    return {
        init,
        setUnit,
    }
})();

$(document).ready(function () {
    app.init();
});

// Implementing add and delete favorite city functionality

var errorScreen = function (errorText) {
    $(".error-message-text").text(errorText); // Pop up error screen with the provided error text
    $(".wrapper").css("display", "block");

    $(".close-error").on("click", function () { // 'hide' the error message when click on 'X' button
        $(".wrapper").css("display", "none");
    });

    $(".error-message-container").on("click", function (e) { // Fire an event when you click outside the box to 'hide' the error message
        $(".wrapper").css("display", "none");
    });

    $(".error-message-screen").on("click", function (e) { // Stop the event from firing on the error message screen
        e.stopPropagation();
    });
}



// $(function () {
//     var checkExistingName = function (cityToCheck) { // check the whole favorite list in local storage for same name
//         var initialFavorites = JSON.parse(localStorage.getItem("favorites"));
//         var isChecked = false;
//         initialFavorites.forEach((val) => {
//             if (cityToCheck === val) {
//                 isChecked = true;
//             }
//         });
//         return isChecked;
//     }

//     var generateFavoriteCities = function () { // Every refresh generate the local storage list of favorite cities
//         var initialFavorites = JSON.parse(localStorage.getItem("favorites"));
//         initialFavorites.forEach((val) => {
//             var placeHolder = `<a class='fav-cities-list' href='#'>
//             <li>` + val + `</li>
//             <span class='cross'>
//                 <i class='fa fa-times' aria-hidden='true'></i>
//             </span>
//             </a>`;
//             $("#ul-fav-cities").append(placeHolder);
//         });
//     }

//     if (localStorage.length === 0) { // checks if there is already modified local storage, if not, set the default cities
//         var holdDefault = ['Varna', 'Sofia', 'Vidin', 'Burgas'];
//         localStorage.setItem("favorites", JSON.stringify(holdDefault));
//         var initialFavorites = JSON.parse(localStorage.getItem("favorites"));
//     }
//     generateFavoriteCities();

//     var deleteItem = function (deletedCity) { // Deleting city from local storage
//         var initialFavorites = JSON.parse(localStorage.getItem("favorites"));
//         for (let i = 0; i < initialFavorites.length; i += 1) {
//             if (initialFavorites[i] === deletedCity) {
//                 initialFavorites.splice(i, 1);
//                 break;
//             }
//         }

//         localStorage.setItem("favorites", JSON.stringify(initialFavorites));
//     }

//     var addCity = function (addedCity) { // Add city in local storage
//         var currentFavorites = JSON.parse(localStorage.getItem("favorites"));
//         currentFavorites.push(addedCity);
//         localStorage.setItem("favorites", JSON.stringify(currentFavorites));
//         currentFavorites = JSON.parse(localStorage.getItem("favorites"));
//     }

//     $("#add-city").on("click", function () { // append the whole fragment for favorite city
//         var $cityName = $(".city-name").text();
//         if (checkExistingName($cityName)) {
//             errorScreen("This city is already in your favorite list!");
//         } else {
//             var placeHolder = `<a class='fav-cities-list' href='#'>
//             <li>` + $cityName + `</li>
//             <span class='cross'>
//                 <i class='fa fa-times' aria-hidden='true'></i>
//             </span>
//             </a>`;
//             $("#ul-fav-cities").append(placeHolder);
//             addCity($cityName);
//         }
//     });

//     $(document).on("click", ".cross", function (e) { // detach the whole fragment for favorite city
//         var name = $(this).prev().text();
//         $(this).parent().css("display", "none");
//         deleteItem(name);
//         e.stopPropagation();
//     });

//     $(document).on("click", ".fav-cities-list", function () { // When clicked on city in the favorite list, refresh the weather-info for this city
//         var a = $(this).children("li").text();
//         console.log(a); // TODO attach it to the module
//     });
// });

$(function() {
    var favorites = (function() {
        var currentFavorites = localStorage.getItem("favorites") ? 
        JSON.parse(localStorage.getItem("favorites")) :
        localStorage.setItem("favorites", JSON.stringify(["Varna", "Sofia", "Plovdiv", "Burgas", "Vidin"]));
        var $ulFavorites = $("#ul-fav-cities");
        render();
        var $anchorList = $(".fav-citites-list");
        var $add = $("#add-city");

        // bind events
        $(document).on("click", ".cross", deleteCity);
        $add.on("click", addCity);
        $(document).on("click", ".fav-cities-list", displayCity);

        function displayCity() {
            var cityToDisplay = $(this).children("li").text();
            console.log(cityToDisplay); // connect with the database module, to refresh the displayed city
        }

        function checkForExistingCity(city) {
            for (let i = 0; i < currentFavorites.length; i += 1) {
                if (currentFavorites[i] === city) {
                    return true;
                }
            }
            return false;
        }

        function render(city) {
            var placeHolder = "";
            if (typeof currentFavorites === "string") {
                currentFavorites = JSON.parse(currentFavorites);
            }

            if (!city) {
                for (let i = 0; i < currentFavorites.length; i += 1) {
                    placeHolder = `<a class='fav-cities-list' href='#'>
                    <li>` + currentFavorites[i] + `</li>
                    <span class='cross'>
                        <i class='fa fa-times' aria-hidden='true'></i>
                    </span>
                    </a>`;

                    $ulFavorites.append(placeHolder);
                }
            } else {
                placeHolder = `<a class='fav-cities-list' href='#'>
                <li>` + city + `</li>
                <span class='cross'>
                    <i class='fa fa-times' aria-hidden='true'></i>
                </span>
                </a>`;
                $ulFavorites.append(placeHolder);
            }
        }

        function addCity() {
            var $cityName = $(".city-name").text();
            if (!checkForExistingCity($cityName)) {
                render($cityName);
                currentFavorites.push($cityName);
                localStorage.setItem("favorites", JSON.stringify(currentFavorites));
            } else {
                // error
            }
        }

        function deleteCity(event) {
            var $cityName = $(this).prev().text();
            $(this).parent().css("display", "none");
            
            for (let i = 0; i < currentFavorites.length; i += 1) {
                if (currentFavorites[i] === $cityName) {
                    currentFavorites.splice(i, 1);
                    break;
                }
            }

            localStorage.setItem("favorites", JSON.stringify(currentFavorites));
            event.stopPropagation();
        }

        return {
            addCity,
            deleteCity
        }
    })();
});

