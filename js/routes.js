/* =========================================
   BUS TRACK - ROUTES JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeRoutes();
});


/* =========================================
   INITIALIZE
========================================= */

function initializeRoutes() {

    setupRouteSearch();

    setupRouteFilters();

    setupRouteCards();

    updateRouteCount();

}


/* =========================================
   ROUTE SEARCH
========================================= */

function setupRouteSearch() {

    const searchInput =
        document.getElementById("routeSearch");

    const searchButton =
        document.getElementById("routeSearchBtn");


    if (!searchInput) {
        return;
    }


    function searchRoutes() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();


        const cards =
            document.querySelectorAll(".route-card");


        let visibleCount = 0;


        cards.forEach(card => {

            const routeNumber =
                card.dataset.route || "";


            const cardText =
                card.textContent.toLowerCase();


            const matches =
                searchText === "" ||
                routeNumber
                    .toLowerCase()
                    .includes(searchText) ||
                cardText.includes(searchText);


            if (matches) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        updateRouteCount(visibleCount);

        showNoRoutesMessage(
            visibleCount === 0
        );

    }


    searchInput.addEventListener(
        "input",
        searchRoutes
    );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchRoutes
        );

    }


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                searchRoutes();

            }

        }
    );

}


/* =========================================
   ROUTE FILTERS
========================================= */

function setupRouteFilters() {

    const filters =
        document.querySelectorAll(
            ".route-filter"
        );


    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                filter.classList.add(
                    "active"
                );


                const filterType =
                    filter.dataset.filter;


                filterRoutes(filterType);

            }
        );

    });

}


/* =========================================
   FILTER ROUTES
========================================= */

function filterRoutes(filterType) {

    const cards =
        document.querySelectorAll(
            ".route-card"
        );


    let visibleCount = 0;


    cards.forEach(card => {

        const routeType =
            card.dataset.type;


        const status =
            card.querySelector(
                ".route-status"
            );


        let isVisible = true;


        if (filterType === "all") {

            isVisible = true;

        }


        else if (filterType === "city") {

            isVisible =
                routeType === "city";

        }


        else if (filterType === "intercity") {

            isVisible =
                routeType === "intercity";

        }


        else if (filterType === "active") {

            isVisible =
                status &&
                status.classList.contains(
                    "active"
                );

        }


        if (isVisible) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    updateRouteCount(visibleCount);

    showNoRoutesMessage(
        visibleCount === 0
    );

}


/* =========================================
   ROUTE CARDS
========================================= */

function setupRouteCards() {

    const cards =
        document.querySelectorAll(
            ".route-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /*
                    Don't trigger when clicking
                    the Track/View button.
                */

                if (
                    event.target.closest(
                        "a"
                    )
                ) {

                    return;

                }


                const routeNumber =
                    card.dataset.route;


                highlightRoute(
                    card
                );


                console.log(
                    `Selected route: ${routeNumber}`
                );

            }
        );

    });

}


/* =========================================
   HIGHLIGHT ROUTE
========================================= */

function highlightRoute(card) {

    const cards =
        document.querySelectorAll(
            ".route-card"
        );


    cards.forEach(item => {

        item.classList.remove(
            "selected"
        );

    });


    card.classList.add(
        "selected"
    );

}


/* =========================================
   UPDATE ROUTE COUNT
========================================= */

function updateRouteCount(
    count = null
) {

    const counter =
        document.getElementById(
            "routeCount"
        );


    if (!counter) {
        return;
    }


    if (count === null) {

        const cards =
            document.querySelectorAll(
                ".route-card"
            );


        count = cards.length;

    }


    counter.textContent =
        `${count} route${count === 1 ? "" : "s"}`;

}


/* =========================================
   NO ROUTES MESSAGE
========================================= */

function showNoRoutesMessage(
    show
) {

    const message =
        document.getElementById(
            "noRoutes"
        );


    if (!message) {
        return;
    }


    message.style.display =
        show ? "block" : "none";

}


/* =========================================
   ROUTE URL SUPPORT
========================================= */

function handleRouteURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const route =
        params.get("route");


    if (!route) {
        return;
    }


    const card =
        document.querySelector(
            `.route-card[data-route="${route}"]`
        );


    if (!card) {
        return;
    }


    highlightRoute(card);


    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================
   INITIALIZE URL ROUTE
========================================= */

handleRouteURL();


/* =========================================
   ROUTE CARD HOVER EFFECT
========================================= */

document
    .querySelectorAll(".route-card")
    .forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                    "translateY(-3px)";

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                if (
                    !card.classList.contains(
                        "selected"
                    )
                ) {

                    card.style.transform =
                        "";

                }

            }
        );

    });
