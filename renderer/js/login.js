const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");

const message = document.getElementById("message");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = emailInput.value.trim();

    const password = passwordInput.value;


    // Clear old message
    message.textContent = "";


    // Check email
    if (!email) {

        message.textContent = "Please enter your email.";

        message.style.color = "#dc2626";

        return;
    }


    // Check password
    if (!password) {

        message.textContent = "Please enter your password.";

        message.style.color = "#dc2626";

        return;
    }


    loginBtn.disabled = true;

    loginBtn.textContent = "Signing In...";


    try {

        console.log("Trying login with:", email);


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        console.log("Supabase response:", data);

        console.log("Supabase error:", error);


        if (error) {

            throw error;

        }


        message.textContent =
            "Login successful!";

        message.style.color =
            "#15803d";


        console.log(
            "Logged in user:",
            data.user
        );


        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 500);


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        message.textContent =
            error.message ||
            "Login failed.";

        message.style.color =
            "#dc2626";


        loginBtn.disabled = false;

        loginBtn.textContent =
            "Sign In";

    }

});