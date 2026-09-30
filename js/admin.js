/* =========================================
   BUS TRACK - ADMIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeAdmin();
});


/* =========================================
   INITIALIZE ADMIN
========================================= */

function initializeAdmin() {

    setupBusSearch();

    setupAdminActions();

    setupTableActions();

    loadAdminStatistics();

}


/* =========================================
   BUS SEARCH
========================================= */

function setupBusSearch() {

    const searchInput =
        document.getElementById("busSearch");

    const tableBody =
        document.getElementById("busTableBody");


    if (!searchInput || !tableBody) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const rows =
                tableBody.querySelectorAll(
                    "tr"
                );


            rows.forEach(row => {

                const text =
                    row.textContent
                        .toLowerCase();


                if (
                    text.includes(
                        searchTerm
                    )
                ) {

                    row.style.display =
                        "";

                } else {

                    row.style.display =
                        "none";

                }

            });

        }
    );

}


/* =========================================
   ADMIN ACTION BUTTONS
========================================= */

function setupAdminActions() {

    const addBusBtn =
        document.getElementById(
            "addBusBtn"
        );


    const addRouteBtn =
        document.getElementById(
            "addRouteBtn"
        );


    const addStopBtn =
        document.getElementById(
            "addStopBtn"
        );


    const refreshDataBtn =
        document.getElementById(
            "refreshDataBtn"
        );


    if (addBusBtn) {

        addBusBtn.addEventListener(
            "click",
            addBus
        );

    }


    if (addRouteBtn) {

        addRouteBtn.addEventListener(
            "click",
            addRoute
        );

    }


    if (addStopBtn) {

        addStopBtn.addEventListener(
            "click",
            addStop
        );

    }


    if (refreshDataBtn) {

        refreshDataBtn.addEventListener(
            "click",
            refreshDashboard
        );

    }

}


/* =========================================
   ADD BUS
========================================= */

function addBus() {

    const busNumber =
        prompt(
            "Enter bus number:"
        );


    if (!busNumber) {
        return;
    }


    const route =
        prompt(
            "Enter route number:"
        );


    if (!route) {
        return;
    }


    const driver =
        prompt(
            "Enter driver name:"
        );


    if (!driver) {
        return;
    }


    const bus = {

        id:
            "BT-" +
            Date.now(),

        number:
            busNumber,

        route:
            route,

        driver:
            driver,

        status:
            "Active",

        speed:
            "0 km/h"

    };


    saveBus(bus);

    addBusToTable(bus);

    updateBusCount();

    showAdminMessage(
        "Bus added successfully."
    );

}


/* =========================================
   SAVE BUS
========================================= */

function saveBus(bus) {

    const saved =
        localStorage.getItem(
            "busTrackBuses"
        );


    let buses = [];


    if (saved) {

        try {

            buses =
                JSON.parse(saved);

        } catch (error) {

            buses = [];

        }

    }


    buses.push(bus);


    localStorage.setItem(
        "busTrackBuses",
        JSON.stringify(buses)
    );

}


/* =========================================
   ADD BUS TO TABLE
========================================= */

function addBusToTable(bus) {

    const tableBody =
        document.getElementById(
            "busTableBody"
        );


    if (!tableBody) {
        return;
    }


    const row =
        document.createElement(
            "tr"
        );


    row.dataset.bus =
        bus.id;


    row.innerHTML = `

        <td>

            <div class="table-bus">

                <span class="table-bus-icon">
                    🚌
                </span>

                <div>

                    <strong>
                        ${escapeHTML(bus.id)}
                    </strong>

                    <small>
                        ${escapeHTML(bus.number)}
                    </small>

                </div>

            </div>

        </td>


        <td>
            Route ${escapeHTML(bus.route)}
        </td>


        <td>
            ${escapeHTML(bus.driver)}
        </td>


        <td>

            <span class="table-status active">
                Active
            </span>

        </td>


        <td>
            0 km/h
        </td>


        <td>

            <button
                class="table-btn track"
                data-bus-id="${escapeHTML(bus.route)}"
            >
                Track
            </button>

            <button
                class="table-btn edit"
                data-bus-id="${escapeHTML(bus.id)}"
            >
                Edit
            </button>

        </td>

    `;


    tableBody.appendChild(row);

    setupRowButtons(row);

}


/* =========================================
   ADD ROUTE
========================================= */

function addRoute() {

    const routeNumber =
        prompt(
            "Enter route number:"
        );


    if (!routeNumber) {
        return;
    }


    const start =
        prompt(
            "Enter starting location:"
        );


    if (!start) {
        return;
    }


    const destination =
        prompt(
            "Enter destination:"
        );


    if (!destination) {
        return;
    }


    const route = {

        id:
            routeNumber,

        start:
            start,

        destination:
            destination

    };


    saveRoute(route);


    showAdminMessage(
        `Route ${routeNumber} added successfully.`
    );

}


/* =========================================
   SAVE ROUTE
========================================= */

function saveRoute(route) {

    const saved =
        localStorage.getItem(
            "busTrackAdminRoutes"
        );


    let routes = [];


    if (saved) {

        try {

            routes =
                JSON.parse(saved);

        } catch (error) {

            routes = [];

        }

    }


    routes.push(route);


    localStorage.setItem(
        "busTrackAdminRoutes",
        JSON.stringify(routes)
    );

}


/* =========================================
   ADD STOP
========================================= */

function addStop() {

    const stopName =
        prompt(
            "Enter bus stop name:"
        );


    if (!stopName) {
        return;
    }


    const location =
        prompt(
            "Enter stop location:"
        );


    if (!location) {
        return;
    }


    const stop = {

        id:
            "STOP-" +
            Date.now(),

        name:
            stopName,

        location:
            location

    };


    saveStop(stop);


    showAdminMessage(
        `${stopName} added successfully.`
    );

}


/* =========================================
   SAVE STOP
========================================= */

function saveStop(stop) {

    const saved =
        localStorage.getItem(
            "busTrackAdminStops"
        );


    let stops = [];


    if (saved) {

        try {

            stops =
                JSON.parse(saved);

        } catch (error) {

            stops = [];

        }

    }


    stops.push(stop);


    localStorage.setItem(
        "busTrackAdminStops",
        JSON.stringify(stops)
    );

}


/* =========================================
   TABLE ACTIONS
========================================= */

function setupTableActions() {

    const buttons =
        document.querySelectorAll(
            ".table-btn"
        );


    buttons.forEach(button => {

        setupTableButton(button);

    });

}


/* =========================================
   SETUP TABLE BUTTON
========================================= */

function setupTableButton(button) {

    if (
        button.dataset.initialized ===
        "true"
    ) {

        return;

    }


    button.dataset.initialized =
        "true";


    button.addEventListener(
        "click",
        () => {

            const busId =
                button.dataset.busId;


            if (
                button.classList.contains(
                    "track"
                )
            ) {

                trackBus(busId);

            }


            if (
                button.classList.contains(
                    "edit"
                )
            ) {

                editBus(busId);

            }

        }
    );

}


/* =========================================
   SETUP NEW ROW BUTTONS
========================================= */

function setupRowButtons(row) {

    const buttons =
        row.querySelectorAll(
            ".table-btn"
        );


    buttons.forEach(button => {

        setupTableButton(button);

    });

}


/* =========================================
   TRACK BUS
========================================= */

function trackBus(busId) {

    if (!busId) {
        return;
    }


    window.location.href =
        `tracking.html?bus=${encodeURIComponent(busId)}`;

}


/* =========================================
   EDIT BUS
========================================= */

function editBus(busId) {

    const newDriver =
        prompt(
            "Enter new driver name:"
        );


    if (!newDriver) {
        return;
    }


    const rows =
        document.querySelectorAll(
            "#busTableBody tr"
        );


    rows.forEach(row => {

        const editButton =
            row.querySelector(
                ".table-btn.edit"
            );


        if (
            editButton &&
            editButton.dataset.busId ===
                busId
        ) {

            const cells =
                row.querySelectorAll(
                    "td"
                );


            if (cells[2]) {

                cells[2].textContent =
                    newDriver;

            }

        }

    });


    updateStoredBusDriver(
        busId,
        newDriver
    );


    showAdminMessage(
        "Bus information updated."
    );

}


/* =========================================
   UPDATE STORED DRIVER
========================================= */

function updateStoredBusDriver(
    busId,
    driver
) {

    const saved =
        localStorage.getItem(
            "busTrackBuses"
        );


    if (!saved) {
        return;
    }


    try {

        const buses =
            JSON.parse(saved);


        const bus =
            buses.find(
                item =>
                    item.id ===
                    busId
            );


        if (bus) {

            bus.driver =
                driver;

        }


        localStorage.setItem(
            "busTrackBuses",
            JSON.stringify(buses)
        );

    } catch (error) {

        console.error(
            "Could not update bus:",
            error
        );

    }

}


/* =========================================
   REFRESH DASHBOARD
========================================= */

function refreshDashboard() {

    const button =
        document.getElementById(
            "refreshDataBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.style.opacity =
            "0.6";

    }


    setTimeout(
        () => {

            loadAdminStatistics();


            if (button) {

                button.disabled =
                    false;

                button.style.opacity =
                    "1";

            }


            showAdminMessage(
                "Dashboard data refreshed."
            );

        },
        700
    );

}


/* =========================================
   ADMIN STATISTICS
========================================= */

function loadAdminStatistics() {

    const storedBuses =
        getStoredBuses();


    const totalBuses =
        document.getElementById(
            "totalBuses"
        );


    if (
        totalBuses &&
        storedBuses.length > 0
    ) {

        /*
            Keep the demo buses and
            add locally-created buses.
        */

        const demoCount =
            48;


        totalBuses.textContent =
            demoCount +
            storedBuses.length;

    }


    const activeBuses =
        document.getElementById(
            "activeBuses"
        );


    if (
        activeBuses &&
        storedBuses.length > 0
    ) {

        const activeCount =
            storedBuses.filter(
                bus =>
                    bus.status ===
                    "Active"
            ).length;


        activeBuses.textContent =
            36 +
            activeCount;

    }


    const totalRoutes =
        document.getElementById(
            "totalRoutes"
        );


    const storedRoutes =
        getStoredRoutes();


    if (
        totalRoutes &&
        storedRoutes.length > 0
    ) {

        totalRoutes.textContent =
            24 +
            storedRoutes.length;

    }

}


/* =========================================
   GET STORED BUSES
========================================= */

function getStoredBuses() {

    const saved =
        localStorage.getItem(
            "busTrackBuses"
        );


    if (!saved) {
        return [];
    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        return [];

    }

}


/* =========================================
   GET STORED ROUTES
========================================= */

function getStoredRoutes() {

    const saved =
        localStorage.getItem(
            "busTrackAdminRoutes"
        );


    if (!saved) {
        return [];
    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        return [];

    }

}


/* =========================================
   UPDATE BUS COUNT
========================================= */

function updateBusCount() {

    const totalBuses =
        document.getElementById(
            "totalBuses"
        );


    if (!totalBuses) {
        return;
    }


    const storedBuses =
        getStoredBuses();


    totalBuses.textContent =
        48 +
        storedBuses.length;

}


/* =========================================
   ADMIN MESSAGE
========================================= */

function showAdminMessage(
    message
) {

    const existing =
        document.querySelector(
            ".admin-message"
        );


    if (existing) {
        existing.remove();
    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        "admin-message";


    messageElement.textContent =
        message;


    messageElement.style.cssText = `

        position: fixed;

        right: 25px;

        bottom: 25px;

        z-index: 9999;

        max-width: 350px;

        padding: 14px 20px;

        background: #0f172a;

        color: white;

        border-radius: 10px;

        font-size: 14px;

        font-weight: 600;

        box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.2);

        animation:
            adminMessageIn
            0.25s ease;

    `;


    document.body.appendChild(
        messageElement
    );


    setTimeout(
        () => {

            messageElement.style.opacity =
                "0";

            messageElement.style.transform =
                "translateY(10px)";


            setTimeout(
                () => {

                    messageElement.remove();

                },
                300
            );

        },
        2500
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(value);


    return element.innerHTML;

}
