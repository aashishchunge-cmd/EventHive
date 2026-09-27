// =========================================
// EVENTHIVE EVENTS
// =========================================


const eventForm =
    document.getElementById("eventForm");


const eventName =
    document.getElementById("eventName");


const eventDetails =
    document.getElementById("eventDetails");


const eventsList =
    document.getElementById("eventsList");


const saveBtn =
    document.getElementById("saveBtn");


const message =
    document.getElementById("message");


const userEmail =
    document.getElementById("userEmail");


const logoutBtn =
    document.getElementById("logoutBtn");


let currentUser = null;

let editingEventId = null;


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
// GET USER
// =========================================

async function getCurrentUser() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !data.user
    ) {

        window.location.href =
            "login.html";

        return null;
    }


    currentUser =
        data.user;


    userEmail.textContent =
        currentUser.email;


    return currentUser;
}


// =========================================
// LOAD EVENTS
// =========================================

async function loadEvents() {

    if (!currentUser) {

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient

            .from("events")

            .select("*")

            .eq(
                "user_id",
                currentUser.id
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            error
        );

        eventsList.innerHTML = `

            <div class="empty-events">

                Unable to load events.

            </div>

        `;

        return;
    }


    displayEvents(data);
}


// =========================================
// DISPLAY EVENTS
// =========================================

function displayEvents(events) {

    eventsList.innerHTML =
        "";


    if (
        !events ||
        events.length === 0
    ) {

        eventsList.innerHTML = `

            <div class="empty-events">

                <div class="empty-events-icon">
                    📅
                </div>

                <h3>
                    No Events Yet
                </h3>

                <p>
                    Create your first event above.
                </p>

            </div>

        `;

        return;
    }


    events.forEach(
        event => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "event-item";


            const date =
                new Date(
                    event.created_at
                )
                .toLocaleDateString();


            div.innerHTML = `

                <div class="event-item-header">

                    <h3>
                        ${escapeHTML(
                            event.event_name
                        )}
                    </h3>

                    <span class="event-date">
                        ${date}
                    </span>

                </div>


                <p>
                    ${escapeHTML(
                        event.event_details
                    )}
                </p>


                <div class="event-actions">

                    <button
                        class="edit-btn"
                        onclick="editEvent('${event.id}', '${escapeHTML(event.event_name).replaceAll("'", "\\'")}', '${escapeHTML(event.event_details).replaceAll("'", "\\'")}')"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteEvent('${event.id}')"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            eventsList.appendChild(
                div
            );

        }
    );
}


// =========================================
// CREATE / UPDATE EVENT
// =========================================

eventForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            eventName.value.trim();


        const details =
            eventDetails.value.trim();


        if (!name || !details) {

            showMessage(
                "Please fill all fields.",
                "red"
            );

            return;
        }


        saveBtn.disabled =
            true;


        saveBtn.textContent =
            editingEventId
                ? "Updating..."
                : "Creating...";


        try {

            // UPDATE

            if (editingEventId) {

                const {
                    error
                } =
                    await supabaseClient

                        .from("events")

                        .update({

                            event_name:
                                name,

                            event_details:
                                details

                        })

                        .eq(
                            "id",
                            editingEventId
                        )

                        .eq(
                            "user_id",
                            currentUser.id
                        );


                if (error) {

                    throw error;

                }


                showMessage(
                    "Event updated successfully!",
                    "green"
                );


            }

            // CREATE

            else {

                const {
                    error
                } =
                    await supabaseClient

                        .from("events")

                        .insert({

                            user_id:
                                currentUser.id,

                            event_name:
                                name,

                            event_details:
                                details

                        });


                if (error) {

                    throw error;

                }


                showMessage(
                    "Event created successfully!",
                    "green"
                );

            }


            eventForm.reset();


            editingEventId =
                null;


            saveBtn.textContent =
                "➕ Create Event";


            await loadEvents();


        } catch (error) {

            console.error(
                error
            );


            showMessage(
                error.message,
                "red"
            );

        }


        saveBtn.disabled =
            false;

    }
);


// =========================================
// EDIT EVENT
// =========================================

window.editEvent =
    function (
        id,
        name,
        details
    ) {

        editingEventId =
            id;


        eventName.value =
            name;


        eventDetails.value =
            details;


        saveBtn.textContent =
            "✏️ Update Event";


        eventName.focus();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


// =========================================
// DELETE EVENT
// =========================================

window.deleteEvent =
    async function (id) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this event?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const {
                error
            } =
                await supabaseClient

                    .from("events")

                    .delete()

                    .eq(
                        "id",
                        id
                    )

                    .eq(
                        "user_id",
                        currentUser.id
                    );


            if (error) {

                throw error;

            }


            showMessage(
                "Event deleted successfully!",
                "green"
            );


            await loadEvents();


        } catch (error) {

            console.error(
                error
            );


            showMessage(
                error.message,
                "red"
            );

        }

    };


// =========================================
// MESSAGE
// =========================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;


    if (type === "green") {

        message.style.color =
            "#15803d";

    } else {

        message.style.color =
            "#dc2626";

    }


    setTimeout(
        () => {

            message.textContent =
                "";

        },
        3000
    );
}


// =========================================
// LOGOUT
// =========================================

logoutBtn.addEventListener(
    "click",
    async function () {

        await supabaseClient
            .auth
            .signOut();


        window.location.href =
            "index.html";

    }
);


// =========================================
// START
// =========================================

async function startApp() {

    const user =
        await getCurrentUser();


    if (user) {

        await loadEvents();

    }

}


startApp();