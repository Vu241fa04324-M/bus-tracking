/* =========================================
   BUS TRACK - AUTHENTICATION JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeAuth();
});


/* =========================================
   INITIALIZE
========================================= */

function initializeAuth() {

    setupPasswordToggle();

    setupLoginForm();

    setupRegisterForm();

    setupGuestLogin();

    setupGoogleLogin();

    setupForgotPassword();

    restoreRememberedUser();

}


/* =========================================
   PASSWORD TOGGLE
========================================= */

function setupPasswordToggle() {

    const toggle =
        document.getElementById("passwordToggle");

    const password =
        document.getElementById("password");


    if (!toggle || !password) {
        return;
    }


    toggle.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            toggle.textContent = "🙈";

            toggle.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            password.type = "password";

            toggle.textContent = "👁️";

            toggle.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

}


/* =========================================
   LOGIN FORM
========================================= */

function setupLoginForm() {

    const form =
        document.getElementById("loginForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();

        loginUser();

    });

}


/* =========================================
   LOGIN USER
========================================= */

function loginUser() {

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const rememberMe =
        document.getElementById("rememberMe");


    if (!emailInput || !passwordInput) {
        return;
    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    clearAuthMessages();

    clearValidation();


    let valid = true;


    /* EMAIL VALIDATION */

    if (!isValidEmail(email)) {

        showFieldError(
            "email",
            "emailError",
            "Please enter a valid email address."
        );

        valid = false;

    }


    /* PASSWORD VALIDATION */

    if (!password) {

        showFieldError(
            "password",
            "passwordError",
            "Please enter your password."
        );

        valid = false;

    } else if (password.length < 6) {

        showFieldError(
            "password",
            "passwordError",
            "Password must contain at least 6 characters."
        );

        valid = false;

    }


    if (!valid) {
        return;
    }


    setLoginLoading(true);


    /*
        Demo authentication.

        For this frontend project we use
        localStorage instead of a real backend.
    */

    setTimeout(() => {

        const users =
            getUsers();


        const existingUser =
            users.find(
                user =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (
            existingUser &&
            existingUser.password !== password
        ) {

            setLoginLoading(false);

            showError(
                "Incorrect password. Please try again."
            );

            return;

        }


        /*
            If no account exists, create a
            demo account automatically.
        */

        let user =
            existingUser;


        if (!user) {

            user = {

                id:
                    "USER-" +
                    Date.now(),

                name:
                    email
                        .split("@")[0]
                        .replace(
                            /[^a-zA-Z0-9]/g,
                            " "
                        ),

                email:
                    email,

                password:
                    password,

                createdAt:
                    new Date().toISOString()

            };


            users.push(user);


            saveUsers(users);

        }


        createSession(
            user,
            rememberMe &&
            rememberMe.checked
        );


        setLoginLoading(false);


        showSuccess(
            "Login successful! Redirecting..."
        );


        setTimeout(() => {

            window.location.href =
                "../index.html";

        }, 900);


    }, 700);

}


/* =========================================
   REGISTER FORM
========================================= */

function setupRegisterForm() {

    const form =
        document.getElementById(
            "registerForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            registerUser();

        }
    );

}


/* =========================================
   REGISTER USER
========================================= */

function registerUser() {

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const confirmInput =
        document.getElementById(
            "confirmPassword"
        );

    const terms =
        document.getElementById("terms");


    if (
        !nameInput ||
        !emailInput ||
        !passwordInput
    ) {

        return;

    }


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmInput
            ? confirmInput.value
            : "";


    clearAuthMessages();

    clearValidation();


    let valid = true;


    /* NAME */

    if (name.length < 2) {

        showFieldError(
            "name",
            "nameError",
            "Please enter your name."
        );

        valid = false;

    }


    /* EMAIL */

    if (!isValidEmail(email)) {

        showFieldError(
            "email",
            "emailError",
            "Please enter a valid email address."
        );

        valid = false;

    }


    /* PASSWORD */

    if (password.length < 6) {

        showFieldError(
            "password",
            "passwordError",
            "Password must contain at least 6 characters."
        );

        valid = false;

    }


    /* CONFIRM PASSWORD */

    if (
        confirmInput &&
        password !== confirmPassword
    ) {

        showFieldError(
            "confirmPassword",
            "confirmPasswordError",
            "Passwords do not match."
        );

        valid = false;

    }


    /* TERMS */

    if (
        terms &&
        !terms.checked
    ) {

        showError(
            "Please accept the terms and conditions."
        );

        valid = false;

    }


    if (!valid) {
        return;
    }


    const users =
        getUsers();


    const alreadyExists =
        users.some(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (alreadyExists) {

        showError(
            "An account with this email already exists."
        );

        return;

    }


    const user = {

        id:
            "USER-" +
            Date.now(),

        name:
            name,

        email:
            email,

        password:
            password,

        createdAt:
            new Date().toISOString()

    };


    users.push(user);

    saveUsers(users);


    showSuccess(
        "Account created successfully! Redirecting to login..."
    );


    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1200);

}


/* =========================================
   GUEST LOGIN
========================================= */

function setupGuestLogin() {

    const button =
        document.getElementById(
            "guestLogin"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const guestUser = {

                id:
                    "GUEST-" +
                    Date.now(),

                name:
                    "Guest User",

                email:
                    "guest@bustrack.local",

                role:
                    "guest"

            };


            createSession(
                guestUser,
                false
            );


            showSuccess(
                "Continuing as guest..."
            );


            setTimeout(() => {

                window.location.href =
                    "../index.html";

            }, 700);

        }
    );

}


/* =========================================
   GOOGLE LOGIN
========================================= */

function setupGoogleLogin() {

    const button =
        document.getElementById(
            "googleLogin"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            showError(
                "Google login requires a backend or Google OAuth configuration. Use email login for this demo."
            );

        }
    );

}


/* =========================================
   FORGOT PASSWORD
========================================= */

function setupForgotPassword() {

    const button =
        document.getElementById(
            "forgotPassword"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "email"
                );


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            if (!email) {

                showError(
                    "Enter your email address first."
                );

                if (emailInput) {
                    emailInput.focus();
                }

                return;

            }


            if (!isValidEmail(email)) {

                showError(
                    "Please enter a valid email address."
                );

                return;

            }


            showSuccess(
                "Password reset instructions would be sent to your email in a real application."
            );

        }
    );

}


/* =========================================
   REMEMBER USER
========================================= */

function restoreRememberedUser() {

    const remembered =
        localStorage.getItem(
            "busTrackRememberedEmail"
        );


    const emailInput =
        document.getElementById(
            "email"
        );


    const rememberCheckbox =
        document.getElementById(
            "rememberMe"
        );


    if (
        remembered &&
        emailInput
    ) {

        emailInput.value =
            remembered;


        if (rememberCheckbox) {

            rememberCheckbox.checked =
                true;

        }

    }

}


/* =========================================
   CREATE SESSION
========================================= */

function createSession(
    user,
    remember
) {

    const session = {

        id:
            user.id,

        name:
            user.name,

        email:
            user.email,

        role:
            user.role || "user",

        loginTime:
            new Date().toISOString()

    };


    sessionStorage.setItem(
        "busTrackSession",
        JSON.stringify(session)
    );


    if (remember) {

        localStorage.setItem(
            "busTrackRememberedEmail",
            user.email
        );

    } else {

        localStorage.removeItem(
            "busTrackRememberedEmail"
        );

    }

}


/* =========================================
   GET CURRENT USER
========================================= */

function getCurrentUser() {

    const session =
        sessionStorage.getItem(
            "busTrackSession"
        );


    if (!session) {
        return null;
    }


    try {

        return JSON.parse(session);

    } catch (error) {

        return null;

    }

}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    sessionStorage.removeItem(
        "busTrackSession"
    );


    window.location.href =
        "pages/login.html";

}


/* =========================================
   GET USERS
========================================= */

function getUsers() {

    const saved =
        localStorage.getItem(
            "busTrackUsers"
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
   SAVE USERS
========================================= */

function saveUsers(users) {

    localStorage.setItem(
        "busTrackUsers",
        JSON.stringify(users)
    );

}


/* =========================================
   VALIDATE EMAIL
========================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================
   SHOW FIELD ERROR
========================================= */

function showFieldError(
    inputId,
    errorId,
    message
) {

    const input =
        document.getElementById(
            inputId
        );


    const error =
        document.getElementById(
            errorId
        );


    if (input) {

        input.classList.add(
            "input-error"
        );

    }


    if (error) {

        error.textContent =
            message;

        error.classList.add(
            "show"
        );

    }

}


/* =========================================
   CLEAR VALIDATION
========================================= */

function clearValidation() {

    const inputs =
        document.querySelectorAll(
            ".auth-form input"
        );


    inputs.forEach(input => {

        input.classList.remove(
            "input-error",
            "input-success"
        );

    });


    const messages =
        document.querySelectorAll(
            ".validation-message"
        );


    messages.forEach(message => {

        message.classList.remove(
            "show"
        );

    });

}


/* =========================================
   SHOW ERROR
========================================= */

function showError(message) {

    const error =
        document.getElementById(
            "loginError"
        );


    if (error) {

        error.textContent =
            message;

        error.classList.add(
            "show"
        );

        return;

    }


    const registerError =
        document.getElementById(
            "registerError"
        );


    if (registerError) {

        registerError.textContent =
            message;

        registerError.classList.add(
            "show"
        );

    }

}


/* =========================================
   SHOW SUCCESS
========================================= */

function showSuccess(message) {

    const success =
        document.getElementById(
            "loginSuccess"
        );


    if (success) {

        success.textContent =
            message;

        success.classList.add(
            "show"
        );

        return;

    }


    const registerSuccess =
        document.getElementById(
            "registerSuccess"
        );


    if (registerSuccess) {

        registerSuccess.textContent =
            message;

        registerSuccess.classList.add(
            "show"
        );

    }

}


/* =========================================
   CLEAR MESSAGES
========================================= */

function clearAuthMessages() {

    const messages =
        document.querySelectorAll(
            ".form-error, .form-success"
        );


    messages.forEach(message => {

        message.classList.remove(
            "show"
        );

        message.textContent =
            "";

    });

}


/* =========================================
   LOGIN LOADING
========================================= */

function setLoginLoading(
    loading
) {

    const button =
        document.getElementById(
            "loginButton"
        );


    const text =
        document.getElementById(
            "loginButtonText"
        );


    if (!button) {
        return;
    }


    if (loading) {

        button.disabled =
            true;


        if (text) {

            text.innerHTML = `
                <span class="auth-loading">
                    <span class="auth-spinner"></span>
                    Logging in...
                </span>
            `;

        }

    } else {

        button.disabled =
            false;


        if (text) {

            text.textContent =
                "Login";

        }

    }

}
