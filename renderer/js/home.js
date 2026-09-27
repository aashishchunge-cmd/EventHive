// =========================================
// EVENTHIVE HOME PAGE
// =========================================


const getStartedBtn =
    document.getElementById("getStartedBtn");


const loginBtn =
    document.getElementById("loginBtn");


// =========================================
// GET STARTED
// =========================================

if (getStartedBtn) {

    getStartedBtn.addEventListener(
        "click",
        async function () {

            try {

                const {
                    data
                } =
                    await supabaseClient
                        .auth
                        .getSession();


                if (
                    data &&
                    data.session
                ) {

                    window.location.href =
                        "dashboard.html";

                } else {

                    window.location.href =
                        "signup.html";

                }

            } catch (error) {

                console.error(
                    error
                );

                window.location.href =
                    "signup.html";

            }

        }
    );

}


// =========================================
// SIGN IN
// =========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "login.html";

        }
    );

}