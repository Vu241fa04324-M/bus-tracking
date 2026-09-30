/* =========================================
   BUS TRACK - STOPS JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeStops();
});


/* =========================================
   INITIALIZE
========================================= */

function initializeStops() {

    setupStopSearch();

    setupNearbyButton();

    updateStopsCount();

    startEtaUpdates();

}


/* =========================================
   STOP SEARCH
========================================= */

function setupStopSearch() {

    const searchInput =
        document.getElementById("stopSearch");

    const searchButton =
        document.getElementById("stopSearchBtn");


    if (!searchInput) {
        return;
    }


    function searchStops() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();


        const stops =
            document.querySelectorAll(".stop-card");


        let visibleCount = 0;


        stops.forEach(stop => {

            const stopName =
                stop.dataset.stop || "";

            const stopContent =
                stop.textContent.toLowerCase();


            const matches =
                searchText === "" ||
                stopName.includes(searchText) ||
                stopContent.includes(searchText);


            if (matches) {

                stop.style.display = "";

                visibleCount++;

            } else {

                stop.style.display = "none";

            }

        });


        updateStopsCount(
            visibleCount
        );


        showNoStopsMessage(
            visibleCount === 0
        );

    }


    searchInput.addEventListener(
        "input",
        searchStops
    );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchStops
        );

    }


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                searchStops();

            }

        }
    );

}


/* =========================================
   UPDATE STOP COUNT
========================================= */

function updateStopsCount(
    count = null
) {

    const counter =
        document.getElementById(
            "stopsCount"
        );


    if (!counter) {
        return;
    }


    if (count === null) {

        const stops =
            document.querySelectorAll(
                ".stop-card"
            );

        count = stops.length;

    }


    counter.textContent =
        `${count} stop${count === 1 ? "" : "s"}`;

}


/* =========================================
   NO RESULTS MESSAGE
========================================= */

function showNoStopsMessage(
    show
) {

    const message =
        document.getElementById(
            "noStops"
        );


    if (!message) {
        return;
    }


    message.style.display =
        show ? "block" : "none";

}


/* =========================================
   FIND NEARBY STOPS
========================================= */

function setupNearbyButton() {

    const button =
        document.getElementById(
            "findNearbyStops"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        findNearbyStops
    );

}


/* =========================================
   GEOLOCATION
========================================= */

function findNearbyStops() {

    const button =
        document.getElementById(
            "findNearbyStops"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "📍 Finding stops...";

    }


    if (!navigator.geolocation) {

        showStopsMessage(
            "Location is not supported by your browser."
        );


        resetNearbyButton();

        return;

    }


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "User location:",
                latitude,
                longitude
            );


            /*
                For this frontend project,
                the stop data is demo data.

                We use the detected location
                to demonstrate nearby-stop sorting.
            */

            sortStopsByDistance(
                latitude,
                longitude
            );


            showStopsMessage(
                "Nearby stops are shown first."
            );


            resetNearbyButton();

        },

        error => {

            console.warn(
                "Location error:",
                error.message
            );


            /*
                If location permission is denied,
                keep the page usable.

                We simply sort the demo stops
                using their predefined order.
            */

            showStopsMessage(
                "Location permission unavailable. Showing available stops."
            );


            resetNearbyButton();

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 60000
        }

    );

}


/* =========================================
   RESET NEARBY BUTTON
========================================= */

function resetNearbyButton() {

    const button =
        document.getElementById(
            "findNearbyStops"
        );


    if (!button) {
        return;
    }


    button.disabled = false;

    button.textContent =
        "📍 Find Stops Near Me";

}


/* =========================================
   SORT STOPS
========================================= */

function sortStopsByDistance(
    userLatitude,
    userLongitude
) {

    const grid =
        document.getElementById(
            "stopsGrid"
        );


    if (!grid) {
        return;
    }


    const stops =
        Array.from(
            grid.querySelectorAll(
                ".stop-card"
            )
        );


    /*
        Demo coordinates.

        These are approximate example
        coordinates used only for the
        frontend demonstration.
    */

    const stopCoordinates = {

        "guntur bus stand": {
            lat: 16.3067,
            lng: 80.4365
        },

        "lakshmipuram": {
            lat: 16.3061,
            lng: 80.4260
        },

        "pedakakani": {
            lat: 16.3737,
            lng: 80.5225
        },

        "amaravati road": {
            lat: 16.3350,
            lng: 80.4300
        },

        "namburu": {
            lat: 16.3500,
            lng: 80.5000
        },

        "nallapadu": {
            lat: 16.3180,
            lng: 80.4100
        },

        "tenali": {
            lat: 16.2425,
            lng: 80.6420
        },

        "vijayawada bus stand": {
            lat: 16.5178,
            lng: 80.6185
        },

        "mangalagiri": {
            lat: 16.4308,
            lng: 80.5684
        },

        "narasaraopet": {
            lat: 16.2350,
            lng: 80.0490
        }

    };


    stops.forEach(stop => {

        const name =
            stop.dataset.stop;


        const coordinates =
            stopCoordinates[name];


        if (coordinates) {

            const distance =
                calculateDistance(
                    userLatitude,
                    userLongitude,
                    coordinates.lat,
                    coordinates.lng
                );


            stop.dataset.distance =
                distance;

        } else {

            stop.dataset.distance =
                999999;

        }

    });


    stops.sort(
        (a, b) => {

            return (
                Number(a.dataset.distance) -
                Number(b.dataset.distance)
            );

        }
    );


    stops.forEach(stop => {

        grid.appendChild(stop);

    });


    /*
        Add distance information.
    */

    stops.forEach(stop => {

        const distance =
            Number(
                stop.dataset.distance
            );


        if (
            !isFinite(distance) ||
            distance >= 999999
        ) {

            return;

        }


        updateStopDistance(
            stop,
            distance
        );

    });

}


/* =========================================
   DISTANCE CALCULATION
   HAVERSINE FORMULA
========================================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371;


    const latDifference =
        degreesToRadians(
            lat2 - lat1
        );


    const lonDifference =
        degreesToRadians(
            lon2 - lon1
        );


    const a =
        Math.sin(
            latDifference / 2
        ) ** 2 +

        Math.cos(
            degreesToRadians(lat1)
        ) *

        Math.cos(
            degreesToRadians(lat2)
        ) *

        Math.sin(
            lonDifference / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;

}


/* =========================================
   DEGREES TO RADIANS
========================================= */

function degreesToRadians(
    degrees
) {

    return (
        degrees *
        Math.PI /
        180
    );

}


/* =========================================
   DISPLAY DISTANCE
========================================= */

function updateStopDistance(
    stop,
    distance
) {

    const existing =
        stop.querySelector(
            ".stop-distance"
        );


    if (existing) {

        existing.remove();

    }


    const distanceElement =
        document.createElement("span");


    distanceElement.className =
        "stop-distance";


    if (distance < 1) {

        distanceElement.textContent =
            `${Math.round(distance * 1000)} m away`;

    } else {

        distanceElement.textContent =
            `${distance.toFixed(1)} km away`;

    }


    const top =
        stop.querySelector(
            ".stop-card-top"
        );


    if (top) {

        top.appendChild(
            distanceElement
        );

    }

}


/* =========================================
   ETA SIMULATION
========================================= */

function startEtaUpdates() {

    setInterval(
        updateEtas,
        30000
    );

}


/* =========================================
   UPDATE ETAS
========================================= */

function updateEtas() {

    const etaElements =
        document.querySelectorAll(
            ".upcoming-bus > span"
        );


    etaElements.forEach(
        element => {

            const currentText =
                element.textContent;


            const match =
                currentText.match(
                    /(\d+)/
                );


            if (!match) {
                return;
            }


            let minutes =
                Number(match[1]);


            /*
                Simulate a bus getting closer.
            */

            if (minutes > 1) {

                minutes--;

            } else {

                /*
                    When it reaches 1 minute,
                    reset to a new estimated time.
                */

                minutes =
                    Math.floor(
                        Math.random() * 10
                    ) + 3;

            }


            element.textContent =
                `${minutes} min`;

        }
    );

}


/* =========================================
   MESSAGE
========================================= */

function showStopsMessage(
    message
) {

    const oldMessage =
        document.querySelector(
            ".stops-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        "stops-message";


    messageElement.textContent =
        message;


    messageElement.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 25px;
        transform: translateX(-50%);
        z-index: 9999;
        padding: 10px 16px;
        background: #0f172a;
        color: #ffffff;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    `;


    document.body.appendChild(
        messageElement
    );


    setTimeout(
        () => {

            messageElement.style.opacity =
                "0";

            messageElement.style.transition =
                "opacity 0.3s ease";


            setTimeout(
                () => {

                    if (
                        messageElement.parentElement
                    ) {

                        messageElement.remove();

                    }

                },
                300
            );

        },
        2500
    );

}


/* =========================================
   STOP CARD CLICK
========================================= */

document
    .querySelectorAll(".stop-card")
    .forEach(stop => {

        stop.addEventListener(
            "click",
            event => {

                /*
                    Don't interfere with
                    Track Bus links.
                */

                if (
                    event.target.closest("a")
                ) {

                    return;

                }


                stop.classList.toggle(
                    "selected"
                );

            }
        );

    });
