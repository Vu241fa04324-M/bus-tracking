/* =========================================
   BUS TRACK - PROFILE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeProfile();
});


/* =========================================
   INITIALIZE PROFILE
========================================= */

function initializeProfile() {

    const user = getProfileUser();

    if (!user) {
        redirectToLogin();
        return;
    }

    displayUserInformation(user);

    setupLogoutButtons();

    setupClearDataButton();

    loadFavoriteRoutes(user);

    loadUserStatistics();

}


/* =========================================
   GET CURRENT USER
========================================= */

function getProfileUser() {

    /*
        auth.js provides getCurrentUser().
    */

    if (typeof getCurrentUser === "function") {

        return getCurrentUser();

    }


    /*
        Fallback in case auth.js is not loaded.
    */

    const localUser =
        localStorage.getItem("busTrackUser");

    const sessionUser =
        sessionStorage.getItem("busTrackUser");

    const savedUser =
        localUser || sessionUser;


    if (!savedUser) {
        return null;
    }


    try {

        return JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Could not read profile user:",
            error
        );

        return null;

    }

}


/* =========================================
   REDIRECT TO LOGIN
========================================= */

function redirectToLogin() {

    window.location.href =
        "login.html";

}


/* =========================================
   DISPLAY USER INFORMATION
========================================= */

function displayUserInformation(user) {

    const name =
        user.name || "User";

    const email =
        user.email || "No email";


    /* Profile name */

    setText(
        "profileName",
        name
    );


    /* Profile email */

    setText(
        "profileEmail",
        email
    );


    /* Account name */

    setText(
        "accountName",
        name
    );


    /* Account email */

    setText(
        "accountEmail",
        email
    );


    /* Account role */

    const role =
        user.role || "user";


    setText(
        "accountRole",
        formatRole(role)
    );


    /* Member since */

    const createdAt =
        user.createdAt;


    if (createdAt) {

        const date =
            new Date(createdAt);


        if (!isNaN(date.getTime())) {

            setText(
                "accountCreated",
                date.toLocaleDateString(
                    "en-IN",
                    {
                        month: "long",
                        year: "numeric"
                    }
                )
            );

        }

    }


    /* Profile initial */

    const initial =
        name
            .charAt(0)
            .toUpperCase();


    setText(
        "profileInitial",
        initial
    );


    setText(
        "navUserInitial",
        initial
    );


    setText(
        "navUserName",
        name
    );

}


/* =========================================
   SET TEXT
========================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================
   FORMAT ROLE
========================================= */

function formatRole(role) {

    if (!role) {
        return "Passenger";
    }


    if (role === "admin") {
        return "Administrator";
    }


    if (role === "user") {
        return "Passenger";
    }


    return (
        role.charAt(0).toUpperCase() +
        role.slice(1)
    );

}


/* =========================================
   LOGOUT BUTTONS
========================================= */

function setupLogoutButtons() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    const profileLogoutBtn =
        document.getElementById(
            "profileLogoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }


    if (profileLogoutBtn) {

        profileLogoutBtn.addEventListener(
            "click",
            logout
        );

    }

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    const confirmed =
        window.confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {
        return;
    }


    if (
        typeof logoutUser ===
        "function"
    ) {

        logoutUser();

        return;

    }


    localStorage.removeItem(
        "busTrackUser"
    );

    sessionStorage.removeItem(
        "busTrackUser"
    );


    window.location.href =
        "login.html";

}


/* =========================================
   FAVORITE ROUTES
========================================= */

function loadFavoriteRoutes(user) {

    const favorites =
        Array.isArray(user.favorites)
            ? user.favorites
            : [];


    const favoritesList =
        document.getElementById(
            "favoritesList"
        );


    const favoritesEmpty =
        document.getElementById(
            "favoritesEmpty"
        );


    if (!favoritesList) {
        return;
    }


    /*
        The HTML currently contains
        two demo favorite routes.

        If the user has actual favorites,
        replace the demo routes.
    */

    if (favorites.length === 0) {

        updateFavoriteCount(2);

        return;

    }


    /*
        Remove existing favorite cards
        while keeping the empty-state element.
    */

    const existingFavorites =
        favoritesList.querySelectorAll(
            ".favorite-route"
        );


    existingFavorites.forEach(
        element => {

            element.remove();

        }
    );


    favorites.forEach(
        favorite => {

            const route =
                normalizeFavorite(
                    favorite
                );


            const card =
                createFavoriteCard(
                    route
                );


            if (favoritesEmpty) {

                favoritesList.insertBefore(
                    card,
                    favoritesEmpty
                );

            } else {

                favoritesList.appendChild(
                    card
                );

            }

        }
    );


    if (favoritesEmpty) {

        favoritesEmpty.style.display =
            favorites.length === 0
                ? "block"
                : "none";

    }


    updateFavoriteCount(
        favorites.length
    );

}


/* =========================================
   NORMALIZE FAVORITE
========================================= */

function normalizeFavorite(
    favorite
) {

    if (
        typeof favorite ===
        "string"
    ) {

        return {

            route:
                favorite,

            destination:
                "Bus Route"

        };

    }


    return {

        route:
            favorite.route ||
            favorite.number ||
            "Unknown",

        destination:
            favorite.destination ||
            favorite.name ||
            "Bus Route"

    };

}


/* =========================================
   CREATE FAVORITE CARD
========================================= */

function createFavoriteCard(
    route
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "favorite-route";


    card.innerHTML = `

        <div class="favorite-route-icon">
            🚌
        </div>

        <div class="favorite-route-info">

            <strong>
                Route ${escapeHTML(route.route)}
            </strong>

            <span>
                ${escapeHTML(route.destination)}
            </span>

        </div>

        <a
            href="tracking.html?bus=${encodeURIComponent(route.route)}"
            class="favorite-track"
        >
            Track →
        </a>

    `;


    return card;

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}


/* =========================================
   FAVORITE COUNT
========================================= */

function updateFavoriteCount(
    count
) {

    setText(
        "favoriteCount",
        count
    );

}


/* =========================================
   USER STATISTICS
========================================= */

function loadUserStatistics() {

    const statistics =
        getStoredStatistics();


    setText(
        "trackedBuses",
        statistics.trackedBuses
    );


    setText(
        "routesViewed",
        statistics.routesViewed
    );


    setText(
        "stopsVisited",
        statistics.stopsVisited
    );

}


/* =========================================
   GET STATISTICS
========================================= */

function getStoredStatistics() {

    const saved =
        localStorage.getItem(
            "busTrackStatistics"
        );


    const defaultStatistics = {

        trackedBuses: 12,

        routesViewed: 8,

        stopsVisited: 24

    };


    if (!saved) {

        return defaultStatistics;

    }


    try {

        const statistics =
            JSON.parse(saved);


        return {

            trackedBuses:
                Number(
                    statistics.trackedBuses
                ) ||
                defaultStatistics.trackedBuses,

            routesViewed:
                Number(
                    statistics.routesViewed
                ) ||
                defaultStatistics.routesViewed,

            stopsVisited:
                Number(
                    statistics.stopsVisited
                ) ||
                defaultStatistics.stopsVisited

        };

    } catch (error) {

        console.error(
            "Could not load statistics:",
            error
        );


        return defaultStatistics;

    }

}


/* =========================================
   CLEAR LOCAL DATA
========================================= */

function setupClearDataButton() {

    const button =
        document.getElementById(
            "clearDataBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "This will remove saved BusTrack data from this browser. Continue?"
                );


            if (!confirmed) {
                return;
            }


            /*
                Keep the login session.

                Remove only application data.
            */

            localStorage.removeItem(
                "busTrackStatistics"
            );


            localStorage.removeItem(
                "busTrackFavorites"
            );


            /*
                Reset displayed statistics.
            */

            loadUserStatistics();


            showProfileMessage(
                "Saved BusTrack data has been cleared."
            );

        }
    );

}


/* =========================================
   PROFILE MESSAGE
========================================= */

function showProfileMessage(
    message
) {

    const oldMessage =
        document.querySelector(
            ".profile-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        "profile-message";


    messageElement.textContent =
        message;


    messageElement.style.cssText = `

        position: fixed;

        left: 50%;

        bottom: 25px;

        transform: translateX(-50%);

        z-index: 9999;

        padding: 12px 18px;

        background: #0f172a;

        color: white;

        border-radius: 8px;

        font-size: 14px;

        font-weight: 600;

        box-shadow:
            0 8px 25px
            rgba(0, 0, 0, 0.2);

    `;


    document.body.appendChild(
        messageElement
    );


    setTimeout(
        () => {

            messageElement.remove();

        },
        3000
    );

}


/* =========================================
   PROFILE NAV BUTTON
========================================= */

const profileNavBtn =
    document.getElementById(
        "profileNavBtn"
    );


if (profileNavBtn) {

    profileNavBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}
