const API_URL = "/api/Appointments";
const ANNOUNCEMENT_API = "/api/Announcement";
let approvedAppointments = [];
let completedAppointments = [];
let notShownAppointments = [];
let selectedAppointment = null;
async function loadDashboard() {

    try {

        const response = await fetch(API_URL);
        const appointments = await response.json();
approvedAppointments =
    appointments.filter(x => x.status === "Approved");

completedAppointments =
    appointments.filter(x => x.status === "Completed");

notShownAppointments =
    appointments.filter(x => x.status === "Client Not Shown");
        document.getElementById("totalAppointments").textContent =
    appointments.length;

document.getElementById("approvedAppointments").textContent =
    approvedAppointments.length;

document.getElementById("completedAppointments").textContent =
    completedAppointments.length;

document.getElementById("pendingAppointments").textContent =
    notShownAppointments.length;

        let html = "";

        approvedAppointments.forEach(a => {

            html += `
            <tr>

                <td>${a.id}</td>

                <td>${a.fullName}</td>

                <td>${new Date(a.appointmentDate).toLocaleDateString()}</td>

                <td>${a.appointmentTime}</td>

                <td>${a.purpose}</td>

                <td>

                    <span class="badge bg-success">
                        ${a.status}
                    </span>

                </td>

                <td>

                    <button
    class="btn btn-primary btn-sm"
    onclick="viewAppointment(${a.id})">

    View

</button>

                </td>

            </tr>
            `;

        });

        document.getElementById("scheduleTableBody").innerHTML = html;
let completedHtml = "";

completedAppointments.forEach(a => {

    completedHtml += `
    <tr>

        <td>${a.id}</td>

        <td>${a.fullName}</td>

        <td>${new Date(a.appointmentDate).toLocaleDateString()}</td>

        <td>${a.appointmentTime}</td>

        <td>${a.purpose}</td>

    </tr>`;
});

if (completedAppointments.length === 0) {

    completedHtml = `
    <tr>

        <td colspan="5" class="text-center">

            No completed enquiries.

        </td>

    </tr>`;
}

document.getElementById("completedTableBody").innerHTML = completedHtml;
// CLIENT NOT SHOWN TABLE

let notShownHtml = "";

notShownAppointments.forEach(a => {

    notShownHtml += `
    <tr>

        <td>${a.id}</td>

        <td>${a.fullName}</td>

        <td>${new Date(a.appointmentDate).toLocaleDateString()}</td>

        <td>${a.appointmentTime}</td>

        <td>${a.purpose}</td>

    </tr>
    `;

});

if (notShownAppointments.length === 0) {

    notShownHtml = `
    <tr>

        <td colspan="5" class="text-center">

            No client not shown records.

        </td>

    </tr>
    `;

}

document.getElementById("notShownTableBody").innerHTML = notShownHtml;
    }

    catch(error){

        console.log(error);

    }

}
function viewAppointment(id) {

    const appointment =
        approvedAppointments.find(a => a.id === id);

    if (!appointment) return;

    selectedAppointment = appointment;

    document.getElementById("viewName").textContent =
        appointment.fullName;

    document.getElementById("viewContact").textContent =
        appointment.contactNumber;

    document.getElementById("viewDate").textContent =
        new Date(appointment.appointmentDate).toLocaleDateString();

    document.getElementById("viewTime").textContent =
        appointment.appointmentTime;

    document.getElementById("viewPurpose").textContent =
        appointment.purpose;

    const modal =
        new bootstrap.Modal(
            document.getElementById("viewModal")
        );

    modal.show();

}
async function updateStatus(status) {

    if (!selectedAppointment) return;

    const response = await fetch(
        API_URL + "/status/" + selectedAppointment.id,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(status)
        }
    );

    if(response.ok){

        bootstrap.Modal
            .getInstance(document.getElementById("viewModal"))
            .hide();

        loadDashboard();

    }
    else{

        alert("Unable to update appointment.");

    }

}
loadDashboard();

document.getElementById("btnCompleted").onclick = function () {
    updateStatus("Completed");
};

document.getElementById("btnNotShown").onclick = function () {
    updateStatus("Client Not Shown");
};
document.getElementById("statusFilter").addEventListener("change", function () {

    const value = this.value;

    const approved = document.getElementById("approvedCard");
    const completed = document.getElementById("completedCard");
    const notShown = document.getElementById("notShownCard");

    approved.style.display = "block";
    completed.style.display = "block";
    notShown.style.display = "block";

    if (value === "Approved") {

        completed.style.display = "none";
        notShown.style.display = "none";

    }

    else if (value === "Completed") {

        approved.style.display = "none";
        notShown.style.display = "none";

    }

    else if (value === "Client Not Shown") {

        approved.style.display = "none";
        completed.style.display = "none";

    }

});
// ======================================
// ANNOUNCEMENT IMAGE PREVIEW
// ======================================

const announcementImage =
    document.getElementById("announcementImage");

const imagePreview =
    document.getElementById("imagePreview");

if (announcementImage && imagePreview) {

    announcementImage.addEventListener("change", function () {

        const file = this.files[0];

        if (file) {

            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = "block";

        } else {

            imagePreview.src = "";
            imagePreview.style.display = "none";

        }

    });

}// Character Counter
const description = document.getElementById("announcementDescription");
const characterCount = document.getElementById("characterCount");

if (description && characterCount) {

    description.addEventListener("input", function () {

        characterCount.textContent =
            `${this.value.length} / 500 characters`;

    });

}
// ===============================
// PUBLISH ANNOUNCEMENT
// ===============================

document.getElementById("publishAnnouncement").addEventListener("click", async function () {

    const announcement = {

        title: document.getElementById("announcementTitle").value,

        description: document.getElementById("announcementDescription").value,

        category: document.getElementById("announcementCategory").value,

        eventDate: document.getElementById("announcementDate").value,

        eventTime: document.getElementById("announcementTime").value,

        location: document.getElementById("announcementLocation").value
    };

    try {

        const response = await fetch(ANNOUNCEMENT_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(announcement)

        });

        if (!response.ok) {

            throw new Error(await response.text());

        }

        alert("Announcement published successfully!");
document.getElementById("announcementTitle").value = "";
document.getElementById("announcementDescription").value = "";
document.getElementById("announcementCategory").selectedIndex = 0;
document.getElementById("announcementDate").value = "";
document.getElementById("announcementTime").value = "";
document.getElementById("announcementLocation").value = "";

document.getElementById("announcementImage").value = "";
document.getElementById("imagePreview").style.display = "none";
        bootstrap.Modal
            .getInstance(document.getElementById("createAnnouncementModal"))
            .hide();

    }
    catch (error) {

        console.error(error);

        alert("Unable to publish announcement.");

    }

});
