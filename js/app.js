/* =========================================
   BUS TRACK - MAIN JAVASCRIPT
========================================= */


/* =========================================
   WAIT FOR PAGE TO LOAD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    initializeMobileMenu();

    initializeBusSearch();

    initializeAnimations();

});


/* =========================================
   DARK MODE
========================================= */

const themeBtn = document.getElementById("themeBtn");


function initializeTheme() {

    if (!themeBtn) {
        return;
    }


    // Check previously saved theme

    const savedTheme =
        localStorage.getItem("busTrackTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    }


    // Theme button

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");


        const isDark =
            document.body.classList.contains("dark");


        if (isDark) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "busTrackTheme",
                "dark"
            );

        } else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "busTrackTheme",
                "light"
            );

        }

    });

}


/* =========================================
   MOBILE MENU
========================================= */

function initializeMobileMenu() {

    const menuBtn =
        document.getElementById("mobileMenuBtn");

    const navMenu =
        document.querySelector(".nav-menu");


    if (!menuBtn || !navMenu) {
        return;
    }


    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");


        const menuOpen =
            navMenu.classList.contains("active");


        if (menuOpen) {

            menuBtn.textContent = "✕";

        } else {

            menuBtn.textContent = "☰";

        }

    });


    // Close menu after clicking a link

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            menuBtn.textContent = "☰";

        });

    });

}


/* =========================================
   BUS SEARCH
========================================= */

function initializeBusSearch() {

    const searchInput =
        document.getElementById("busSearch");

    const searchBtn =
        document.getElementById("searchBtn");


    if (!searchInput || !searchBtn) {
        return;
    }


    function searchBus() {

        const searchValue =
            searchInput.value.trim();


        if (searchValue === "") {

            showSearchMessage(
                "Please enter a bus number or route."
            );

            searchInput.focus();

            return;

        }


        /*
            For now we redirect to the tracking page.

            Later this will connect to our
            bus data and live tracking system.
        */


        const searchQuery =
            encodeURIComponent(searchValue);


        window.location.href =
            `pages/tracking.html?search=${searchQuery}`;

    }


    // Button click

    searchBtn.addEventListener(
        "click",
        searchBus
    );


    // Press Enter

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                searchBus();

            }

        }
    );

}


/* =========================================
   SEARCH MESSAGE
========================================= */

function showSearchMessage(message) {

    const existingMessage =
        document.querySelector(".search-message");


    if (existingMessage) {

        existingMessage.remove();

    }


    const messageElement =
        document.createElement("div");


    messageElement.className =
        "search-message";


    messageElement.textContent =
        message;


    messageElement.style.cssText = `
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;

        padding: 12px 20px;

        background: #0f172a;
        color: white;

        border-radius: 8px;

        font-size: 13px;
        font-weight: 600;

        box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.15);

        animation:
            searchMessageIn 0.3s ease;
    `;


    document.body.appendChild(
        messageElement
    );


    setTimeout(() => {

        messageElement.remove();

    }, 2500);

}


/* =========================================
   ADD SEARCH MESSAGE ANIMATION
========================================= */

const searchStyle =
    document.createElement("style");


searchStyle.textContent = `

    @keyframes searchMessageIn {

        from {
            opacity: 0;
            transform:
                translate(-50%, -10px);
        }

        to {
            opacity: 1;
            transform:
                translate(-50%, 0);
        }

    }

`;


document.head.appendChild(searchStyle);


/* =========================================
   SCROLL ANIMATIONS
========================================= */

function initializeAnimations() {

    const animatedElements =
        document.querySelectorAll(
            ".feature-card, .stat-card, .route-card"
        );


    if (!("IntersectionObserver" in window)) {

        animatedElements.forEach(element => {

            element.style.opacity = "1";

        });

        return;

    }


    animatedElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(20px)";

        element.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";

    });


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.15
            }
        );


    animatedElements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach(link => {

        const linkPage =
            link.getAttribute("href")
                .split("/")
                .pop();


        if (
            linkPage === currentPage ||
            (
                currentPage === "" &&
                linkPage === "index.html"
            )
        ) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });

}


setActiveNavigation();


/* =========================================
   CONSOLE MESSAGE
========================================= */

console.log(
    "%c🚌 BusTrack",
    "color:#2563eb;font-size:20px;font-weight:800;"
);

console.log(
    "Bus Tracking System initialized successfully."
);
