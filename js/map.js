/* =========================================
   BUS TRACK - MAP JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMap();

});


/* =========================================
   MAP VARIABLES
========================================= */

let mapScale = 1;

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.1;


/* =========================================
   INITIALIZE MAP
========================================= */

function initializeMap() {

    const map =
        document.getElementById(
            "trackingMap"
        );


    if (!map) {
        return;
    }


    setupZoomControls();

    setupLocationButton();

    setupBusMarkerHover();

    setupMapDragging();

    updateZoomDisplay();

}


/* =========================================
   ZOOM CONTROLS
========================================= */

function setupZoomControls() {

    const zoomIn =
        document.getElementById(
            "zoomIn"
        );

    const zoomOut =
        document.getElementById(
            "zoomOut"
        );


    if (zoomIn) {

        zoomIn.addEventListener(
            "click",
            () => {

                changeZoom(
                    ZOOM_STEP
                );

            }
        );

    }


    if (zoomOut) {

        zoomOut.addEventListener(
            "click",
            () => {

                changeZoom(
                    -ZOOM_STEP
                );

            }
        );

    }

}


/* =========================================
   CHANGE ZOOM
========================================= */

function changeZoom(amount) {

    mapScale += amount;


    /*
        Keep zoom between
        minimum and maximum.
    */

    mapScale =
        Math.max(
            MIN_ZOOM,
            Math.min(
                MAX_ZOOM,
                mapScale
            )
        );


    applyMapZoom();

    updateZoomDisplay();

}


/* =========================================
   APPLY MAP ZOOM
========================================= */

function applyMapZoom() {

    const map =
        document.getElementById(
            "trackingMap"
        );


    if (!map) {
        return;
    }


    /*
        Scale the visual map.

        We keep the map container itself
        stable while scaling its contents.
    */

    const mapChildren =
        map.querySelectorAll(
            ".map-road, .map-water, .map-area, .tracking-stop, .tracking-bus, .user-location"
        );


    mapChildren.forEach(element => {

        /*
            Save original position only once.
        */

        if (
            !element.dataset.originalTransform
        ) {

            element.dataset.originalTransform =
                element.style.transform || "";

        }


        const originalTransform =
            element.dataset.originalTransform;


        element.style.transform =
            `${originalTransform} scale(${mapScale})`;

    });

}


/* =========================================
   UPDATE ZOOM TEXT
========================================= */

function updateZoomDisplay() {

    const zoomDisplay =
        document.getElementById(
            "mapZoomLevel"
        );


    if (!zoomDisplay) {
        return;
    }


    const percentage =
        Math.round(
            mapScale * 100
        );


    zoomDisplay.textContent =
        `${percentage}%`;

}


/* =========================================
   LOCATION BUTTON
========================================= */

function setupLocationButton() {

    const locationButton =
        document.getElementById(
            "locateMe"
        );


    if (!locationButton) {
        return;
    }


    locationButton.addEventListener(
        "click",
        findUserLocation
    );

}


/* =========================================
   FIND USER LOCATION
========================================= */

function findUserLocation() {

    const locationMarker =
        document.getElementById(
            "userLocation"
        );


    if (!locationMarker) {
        return;
    }


    /*
        Browser geolocation.
    */

    if (
        !navigator.geolocation
    ) {

        showMapMessage(
            "Location is not supported by your browser."
        );

        moveMarkerToDefaultLocation();

        return;

    }


    showMapMessage(
        "Finding your location..."
    );


    navigator.geolocation.getCurrentPosition(

        position => {

            /*
                This is a demo map,
                not a real geographic map.

                We therefore place the marker
                at a representative location.
            */

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "User coordinates:",
                latitude,
                longitude
            );


            /*
                Convert coordinates into
                demo-map coordinates.
            */

            const mapPosition =
                convertCoordinatesToMapPosition(
                    latitude,
                    longitude
                );


            locationMarker.style.left =
                `${mapPosition.left}%`;

            locationMarker.style.top =
                `${mapPosition.top}%`;


            locationMarker.classList.add(
                "location-found"
            );


            showMapMessage(
                "Your location found."
            );

        },

        error => {

            console.warn(
                "Location error:",
                error.message
            );


            moveMarkerToDefaultLocation();


            showMapMessage(
                "Using demo location."
            );

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 30000
        }

    );

}


/* =========================================
   DEFAULT LOCATION
========================================= */

function moveMarkerToDefaultLocation() {

    const locationMarker =
        document.getElementById(
            "userLocation"
        );


    if (!locationMarker) {
        return;
    }


    /*
        Default demo position.
    */

    locationMarker.style.left =
        "55%";

    locationMarker.style.top =
        "45%";


    locationMarker.classList.add(
        "location-found"
    );

}


/* =========================================
   COORDINATE CONVERSION
========================================= */

function convertCoordinatesToMapPosition(
    latitude,
    longitude
) {

    /*
        Demo coordinate conversion.

        This does NOT represent a real map projection.

        It simply creates a stable visual position
        for the demonstration map.
    */


    let left =
        50 +
        ((longitude - 80.6) * 8);


    let top =
        50 -
        ((latitude - 16.3) * 8);


    /*
        Keep marker inside map.
    */

    left =
        Math.max(
            10,
            Math.min(
                90,
                left
            )
        );


    top =
        Math.max(
            10,
            Math.min(
                90,
                top
            )
        );


    return {
        left,
        top
    };

}


/* =========================================
   BUS MARKER HOVER
========================================= */

function setupBusMarkerHover() {

    const buses =
        document.querySelectorAll(
            ".tracking-bus"
        );


    buses.forEach(bus => {

        bus.addEventListener(
            "mouseenter",
            () => {

                showBusTooltip(bus);

            }
        );


        bus.addEventListener(
            "mouseleave",
            () => {

                hideBusTooltip();

            }
        );

    });

}


/* =========================================
   BUS TOOLTIP
========================================= */

function showBusTooltip(bus) {

    const busNumber =
        bus.dataset.bus;


    if (!busNumber) {
        return;
    }


    /*
        Remove old tooltip.
    */

    hideBusTooltip();


    const tooltip =
        document.createElement("div");


    tooltip.className =
        "map-bus-tooltip";


    tooltip.textContent =
        `Bus ${busNumber}`;


    tooltip.style.cssText = `
        position: absolute;

        z-index: 100;

        padding: 6px 9px;

        background: #0f172a;

        color: #ffffff;

        border-radius: 5px;

        font-size: 9px;

        font-weight: 700;

        pointer-events: none;

        white-space: nowrap;

        transform:
            translate(-50%, -125%);
    `;


    /*
        Copy bus position.
    */

    tooltip.style.left =
        bus.offsetLeft +
        bus.offsetWidth / 2 +
        "px";


    tooltip.style.top =
        bus.offsetTop +
        "px";


    const map =
        document.getElementById(
            "trackingMap"
        );


    if (map) {

        map.appendChild(
            tooltip
        );

    }

}


/* =========================================
   HIDE TOOLTIP
========================================= */

function hideBusTooltip() {

    const tooltip =
        document.querySelector(
            ".map-bus-tooltip"
        );


    if (tooltip) {

        tooltip.remove();

    }

}


/* =========================================
   MAP DRAGGING
========================================= */

function setupMapDragging() {

    const map =
        document.getElementById(
            "trackingMap"
        );


    if (!map) {
        return;
    }


    let isDragging = false;

    let startX = 0;

    let startY = 0;

    let currentX = 0;

    let currentY = 0;


    map.addEventListener(
        "mousedown",
        event => {

            /*
                Don't drag when clicking
                controls or buses.
            */

            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            isDragging = true;

            startX =
                event.clientX -
                currentX;

            startY =
                event.clientY -
                currentY;


            map.classList.add(
                "dragging"
            );

        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (!isDragging) {
                return;
            }


            currentX =
                event.clientX -
                startX;

            currentY =
                event.clientY -
                startY;


            /*
                Limit dragging.
            */

            currentX =
                Math.max(
                    -120,
                    Math.min(
                        120,
                        currentX
                    )
                );


            currentY =
                Math.max(
                    -120,
                    Math.min(
                        120,
                        currentY
                    )
                );


            map.style.backgroundPosition =
                `${currentX}px ${currentY}px`;

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            isDragging = false;

            map.classList.remove(
                "dragging"
            );

        }
    );


    /*
        Touch support for mobile.
    */

    let touchStartX = 0;

    let touchStartY = 0;


    map.addEventListener(
        "touchstart",
        event => {

            if (
                event.touches.length !== 1
            ) {

                return;

            }


            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    map.addEventListener(
        "touchmove",
        event => {

            if (
                event.touches.length !== 1
            ) {

                return;

            }


            const touch =
                event.touches[0];


            const differenceX =
                touch.clientX -
                touchStartX;


            const differenceY =
                touch.clientY -
                touchStartY;


            currentX +=
                differenceX * 0.2;

            currentY +=
                differenceY * 0.2;


            currentX =
                Math.max(
                    -120,
                    Math.min(
                        120,
                        currentX
                    )
                );


            currentY =
                Math.max(
                    -120,
                    Math.min(
                        120,
                        currentY
                    )
                );


            map.style.backgroundPosition =
                `${currentX}px ${currentY}px`;


            touchStartX =
                touch.clientX;

            touchStartY =
                touch.clientY;

        },
        {
            passive: true
        }
    );

}


/* =========================================
   MAP MESSAGE
========================================= */

function showMapMessage(message) {

    const existing =
        document.querySelector(
            ".map-message"
        );


    if (existing) {
        existing.remove();
    }


    const messageElement =
        document.createElement("div");


    messageElement.className =
        "map-message";


    messageElement.textContent =
        message;


    messageElement.style.cssText = `
        position: absolute;

        z-index: 200;

        left: 50%;

        top: 18px;

        transform:
            translateX(-50%);

        padding: 8px 13px;

        background: #0f172a;

        color: #ffffff;

        border-radius: 7px;

        font-size: 9px;

        font-weight: 700;

        box-shadow:
            0 5px 15px
            rgba(15, 23, 42, 0.2);

        pointer-events: none;

        white-space: nowrap;
    `;


    const map =
        document.getElementById(
            "trackingMap"
        );


    if (map) {

        map.appendChild(
            messageElement
        );

    }


    setTimeout(() => {

        if (messageElement) {

            messageElement.style.opacity =
                "0";

            messageElement.style.transition =
                "0.3s ease";

        }


        setTimeout(() => {

            if (
                messageElement &&
                messageElement.parentElement
            ) {

                messageElement.remove();

            }

        }, 300);

    }, 1800);

}


/* =========================================
   LOCATION MARKER ANIMATION
========================================= */

const mapAnimationStyle =
    document.createElement("style");


mapAnimationStyle.textContent = `

    .user-location.location-found {
        animation:
            locationFound 1.5s ease;
    }

    .tracking-map.dragging {
        cursor: grabbing;
    }

    .tracking-map {
        cursor: grab;
    }

    @keyframes locationFound {

        0% {
            transform: scale(0.5);
            opacity: 0.3;
        }

        50% {
            transform: scale(1.3);
            opacity: 1;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }

    }

`;


document.head.appendChild(
    mapAnimationStyle
);
