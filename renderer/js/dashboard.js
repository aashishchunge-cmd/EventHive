// =========================================
// EVENTHIVE DASHBOARD
// =========================================


const userEmail =
    document.getElementById("userEmail");


const totalEvents =
    document.getElementById("totalEvents");


const recentCount =
    document.getElementById("recentCount");


const recentEvents =
    document.getElementById("recentEvents");


const logoutBtn =
    document.getElementById("logoutBtn");


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


// =========================================
// LOAD DASHBOARD
// =========================================

async function loadDashboard() {

    try {

        // Get logged-in user

        const {
            data: userData,
            error: userError
        } =
            await supabaseClient
                .auth
                .getUser();


        if (
            userError ||
            !userData.user
        ) {

            window.location.href =
                "login.html";

            return;
        }


        const user =
            userData.user;


        // Display email

        userEmail.textContent =
            user.email;


        // Get user's events

        const {
            data,
            error
        } =
            await supabaseClient

                .from("events")

                .select("*")

                .eq(
                    "user_id",
                    user.id
                )

                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        console.log(
            "Events:",
            data
        );


        // Total events

        totalEvents.textContent =
            data.length;


        // Recent event count

        recentCount.textContent =
            Math.min(
                data.length,
                5
            );


        // Clear list

        recentEvents.innerHTML =
            "";


        // No events

        if (data.length === 0) {

            recentEvents.innerHTML = `

                <div class="empty-dashboard">

                    <div>
                        📅
                    </div>

                    <h3>
                        No Events Yet
                    </h3>

                    <p>
                        Create your first event
                        from the Events page.
                    </p>

                </div>

            `;

            return;
        }


        // Display events

        data
            .slice(0, 5)
            .forEach(
                event => {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "recent-event";


                    const date =
                        new Date(
                            event.created_at
                        )
                        .toLocaleDateString();


                    div.innerHTML = `

                        <div class="recent-event-info">

                            <h3>
                                ${escapeHTML(
                                    event.event_name
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    event.event_details
                                )}
                            </p>

                        </div>

                        <span class="recent-date">
                            ${date}
                        </span>

                    `;


                    recentEvents.appendChild(
                        div
                    );

                }
            );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        recentEvents.innerHTML = `

            <p class="error-message">
                Unable to load events.
            </p>

        `;

    }

}


// =========================================
// LOGOUT
// =========================================

logoutBtn.addEventListener(
    "click",
    async function () {

        logoutBtn.disabled =
            true;

        logoutBtn.textContent =
            "Logging out...";


        const {
            error
        } =
            await supabaseClient
                .auth
                .signOut();


        if (error) {

            console.error(
                error
            );

            logoutBtn.disabled =
                false;

            logoutBtn.textContent =
                "🚪 Logout";

            return;
        }


        window.location.href =
            "index.html";

    }
);


// =========================================
// START
// =========================================

loadDashboard();