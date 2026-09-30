/* =========================================
   BUS TRACK - TRACKING JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeTracking();

});


/* =========================================
   BUS DATA
========================================= */

const busData = {

    "101": {
        number: "101",
        start: "Guntur",
        destination: "Vijayawada",
        location: "Guntur Bus Stand",
        nextStop: "Lakshmipuram",
        eta: 5,
        distance: "18.5 km",
        duration: "28 min",
        driver: "Rajesh Kumar",
        progress: 72
    },

    "205": {
        number: "205",
        start: "Guntur",
        destination: "Amaravati",
        location: "Pedakakani",
        nextStop: "Amaravati Road",
        eta: 8,
        distance: "24.2 km",
        duration: "35 min",
        driver: "Suresh Babu",
        progress: 61
    },

    "310": {
        number: "310",
        start: "Guntur",
        destination: "Tenali",
        location: "Namburu",
        nextStop: "Pedanandipadu",
        eta: 12,
        distance: "31.7 km",
        duration: "42 min",
        driver: "Ravi Kumar",
        progress: 48
    },

    "405": {
        number: "405",
        start: "Guntur",
        destination: "Chilakaluripet",
        location: "Nallapadu",
        nextStop: "Narasaraopet Road",
        eta: 7,
        distance: "21.4 km",
        duration: "31 min",
        driver: "Venkat Rao",
        progress: 67
    }

};


/* =========================================
   CURRENT BUS
========================================= */

let currentBus = "101";


/* =========================================
   INITIALIZE
========================================= */

function initializeTracking() {

    setupBusCards();

    setupFilterButtons();

    setupSearch();

    setupMapBuses();

    updateBusDetails(currentBus);

    startLiveSimulation();

    updateLastUpdated();

}


/* =========================================
   BUS CARDS
========================================= */

function setupBusCards() {

    const cards =
        document.querySelectorAll(
            ".active-bus-card"
        );


    cards.forEach(card => {

        card.addEventListener("click", () => {

            const busNumber =
                card.dataset.bus;

            selectBus(busNumber);

        });

    });

}


/* =========================================
   MAP BUS BUTTONS
========================================= */

function setupMapBuses() {

    const buses =
        document.querySelectorAll(
            ".tracking-bus"
        );


    buses.forEach(bus => {

        bus.addEventListener("click", () => {

            const busNumber =
                bus.dataset.bus;

            selectBus(busNumber);

        });

    });

}


/* =========================================
   FILTER BUTTONS
========================================= */

function setupFilterButtons() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const busNumber =
                    button.dataset.bus;

                selectBus(busNumber);

            }
        );

    });

}


/* =========================================
   SELECT BUS
========================================= */

function selectBus(busNumber) {

    if (!busData[busNumber]) {

        console.warn(
            `Bus ${busNumber} was not found.`
        );

        return;

    }


    currentBus = busNumber;


    updateBusDetails(busNumber);

    updateSelectedCards(busNumber);

    updateSelectedMapBus(busNumber);

    showTrackingNotification(
        `Tracking Bus ${busNumber}`
    );

}


/* =========================================
   UPDATE BUS DETAILS
========================================= */

function updateBusDetails(busNumber) {

    const bus =
        busData[busNumber];


    if (!bus) {
        return;
    }


    const busNumberElement =
        document.getElementById(
            "selectedBusNumber"
        );

    const startElement =
        document.getElementById(
            "selectedStart"
        );

    const destinationElement =
        document.getElementById(
            "selectedDestination"
        );

    const etaElement =
        document.getElementById(
            "etaTime"
        );

    const nextStopElement =
        document.getElementById(
            "nextStop"
        );

    const locationElement =
        document.getElementById(
            "currentLocation"
        );

    const distanceElement =
        document.getElementById(
            "distanceRemaining"
        );

    const durationElement =
        document.getElementById(
            "duration"
        );

    const progressElement =
        document.getElementById(
            "etaProgress"
        );


    if (busNumberElement) {
        busNumberElement.textContent =
            bus.number;
    }


    if (startElement) {
        startElement.textContent =
            bus.start;
    }


    if (destinationElement) {
        destinationElement.textContent =
            bus.destination;
    }


    if (etaElement) {

        etaElement.textContent =
            `${bus.eta} min`;

    }


    if (nextStopElement) {

        nextStopElement.textContent =
            bus.nextStop;

    }


    if (locationElement) {

        locationElement.textContent =
            bus.location;

    }


    if (distanceElement) {

        distanceElement.textContent =
            bus.distance;

    }


    if (durationElement) {

        durationElement.textContent =
            bus.duration;

    }


    if (progressElement) {

        progressElement.style.width =
            `${bus.progress}%`;

    }


    updateDriver(bus.driver);

}


/* =========================================
   UPDATE DRIVER
========================================= */

function updateDriver(driverName) {

    const driverElements =
        document.querySelectorAll(
            ".bus-driver strong"
        );


    driverElements.forEach(element => {

        element.textContent =
            `Driver: ${driverName}`;

    });

}


/* =========================================
   UPDATE SELECTED CARDS
========================================= */

function updateSelectedCards(busNumber) {

    const cards =
        document.querySelectorAll(
            ".active-bus-card"
        );


    cards.forEach(card => {

        card.classList.toggle(
            "selected",
            card.dataset.bus === busNumber
        );

    });


    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.bus === busNumber
        );

    });

}


/* =========================================
   UPDATE MAP BUS
========================================= */

function updateSelectedMapBus(busNumber) {

    const buses =
        document.querySelectorAll(
            ".tracking-bus"
        );


    buses.forEach(bus => {

        bus.classList.toggle(
            "selected",
            bus.dataset.bus === busNumber
        );

    });

}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "trackingSearch"
        );

    const searchButton =
        document.getElementById(
            "trackingSearchBtn"
        );


    if (!searchInput || !searchButton) {
        return;
    }


    function performSearch() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        if (!query) {

            showTrackingNotification(
                "Enter a bus number or route."
            );

            return;

        }


        /*
            Search by bus number
        */

        const foundBus =
            Object.values(busData).find(bus => {

                return (
                    bus.number.toLowerCase()
                        .includes(query) ||

                    bus.start.toLowerCase()
                        .includes(query) ||

                    bus.destination.toLowerCase()
                        .includes(query) ||

                    bus.location.toLowerCase()
                        .includes(query)
                );

            });


        if (foundBus) {

            selectBus(foundBus.number);

            searchInput.value = "";

            return;

        }


        showTrackingNotification(
            "No matching bus found."
        );

    }


    searchButton.addEventListener(
        "click",
        performSearch
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );

}


/* =========================================
   LIVE BUS SIMULATION
========================================= */

function startLiveSimulation() {

    setInterval(() => {

        simulateBusMovement();

        updateLastUpdated();

    }, 5000);

}


/* =========================================
   SIMULATE BUS MOVEMENT
========================================= */

function simulateBusMovement() {

    const buses =
        document.querySelectorAll(
            ".tracking-bus"
        );


    buses.forEach(bus => {

        const busNumber =
            bus.dataset.bus;


        /*
            Generate a small random movement.
        */

        const currentLeft =
            parseFloat(
                bus.style.left ||
                getComputedStyle(bus).left
            );


        const currentTop =
            parseFloat(
                bus.style.top ||
                getComputedStyle(bus).top
            );


        if (
            Number.isNaN(currentLeft) ||
            Number.isNaN(currentTop)
        ) {
            return;
        }


        const movementX =
            (Math.random() - 0.5) * 2;


        const movementY =
            (Math.random() - 0.5) * 2;


        let newLeft =
            currentLeft + movementX;


        let newTop =
            currentTop + movementY;


        /*
            Keep buses inside the map.
        */

        newLeft =
            Math.max(
                8,
                Math.min(88, newLeft)
            );


        newTop =
            Math.max(
                8,
                Math.min(82, newTop)
            );


        bus.style.left =
            `${newLeft}%`;

        bus.style.top =
            `${newTop}%`;


        /*
            Update selected bus ETA
        */

        if (busNumber === currentBus) {

            updateLiveETA();

        }

    });

}


/* =========================================
   LIVE ETA
========================================= */

function updateLiveETA() {

    const bus =
        busData[currentBus];


    if (!bus) {
        return;
    }


    /*
        Small random change for demo purposes.
    */

    const randomChange =
        Math.floor(
            Math.random() * 2
        );


    let newEta =
        bus.eta - randomChange;


    if (newEta < 2) {
        newEta = 2;
    }


    const etaElement =
        document.getElementById(
            "etaTime"
        );


    if (etaElement) {

        etaElement.textContent =
            `${newEta} min`;

    }

}


/* =========================================
   LAST UPDATED
========================================= */

function updateLastUpdated() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) {
        return;
    }


    const now =
        new Date();


    element.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}


/* =========================================
   NOTIFICATION
========================================= */

function showTrackingNotification(message) {

    const existing =
        document.querySelector(
            ".tracking-notification"
        );


    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");


    notification.className =
        "tracking-notification";


    notification.innerHTML = `
        <span>🚌</span>
        <strong>${message}</strong>
    `;


    notification.style.cssText = `
        position: fixed;
        top: 85px;
        right: 20px;
        z-index: 9999;

        display: flex;
        align-items: center;
        gap: 8px;

        padding: 11px 15px;

        background: #0f172a;
        color: #ffffff;

        border-radius: 8px;

        font-size: 11px;

        box-shadow:
            0 10px 30px
            rgba(15, 23, 42, 0.2);

        animation:
            trackingNotificationIn
            0.25s ease;
    `;


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        notification.style.opacity =
            "0";

        notification.style.transform =
            "translateY(-10px)";

        notification.style.transition =
            "0.25s ease";


        setTimeout(() => {

            notification.remove();

        }, 250);

    }, 1800);

}


/* =========================================
   NOTIFICATION ANIMATION
========================================= */

const trackingNotificationStyle =
    document.createElement("style");


trackingNotificationStyle.textContent = `

    @keyframes trackingNotificationIn {

        from {
            opacity: 0;
            transform:
                translateY(-10px);
        }

        to {
            opacity: 1;
            transform:
                translateY(0);
        }

    }

`;


document.head.appendChild(
    trackingNotificationStyle
);
