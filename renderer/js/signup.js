const signupForm =
    document.getElementById("signupForm");


const emailInput =
    document.getElementById("email");


const passwordInput =
    document.getElementById("password");


const confirmPasswordInput =
    document.getElementById("confirmPassword");


const signupBtn =
    document.getElementById("signupBtn");


const message =
    document.getElementById("message");


signupForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        message.textContent = "";


        /* CHECK EMAIL */

        if (!email) {

            message.textContent =
                "Please enter your email.";

            message.style.color =
                "#dc2626";

            return;
        }


        /* CHECK PASSWORD */

        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            message.style.color =
                "#dc2626";

            return;
        }


        /* CHECK CONFIRM PASSWORD */

        if (
            password !==
            confirmPassword
        ) {

            message.textContent =
                "Passwords do not match.";

            message.style.color =
                "#dc2626";

            return;
        }


        signupBtn.disabled =
            true;

        signupBtn.textContent =
            "Creating Account...";


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signUp({

                        email: email,

                        password: password

                    });


            if (error) {

                throw error;

            }


            console.log(
                "Signup result:",
                data
            );


            message.textContent =
                "Account created successfully!";

            message.style.color =
                "#15803d";


            signupForm.reset();


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1000
            );


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );


            message.textContent =
                error.message ||
                "Unable to create account.";

            message.style.color =
                "#dc2626";


            signupBtn.disabled =
                false;

            signupBtn.textContent =
                "Create Account";
        }

    }
);