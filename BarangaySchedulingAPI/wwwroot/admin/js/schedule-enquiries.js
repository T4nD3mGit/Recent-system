
        const API_URL = "/api/Appointments";

        // LOAD APPOINTMENTS
        async function loadAppointments(){
            try{
                const response = await fetch(API_URL);
                const appointments = await response.json();

                document.getElementById("totalRecords").innerHTML = appointments.length;
                document.getElementById("pendingCount").innerHTML = appointments.filter(x=>x.status=="Pending").length;
                document.getElementById("approvedCount").innerHTML = appointments.filter(x=>x.status=="Approved").length;
                document.getElementById("completedCount").innerHTML = appointments.filter(x=>x.status=="Completed").length;
                document.getElementById("cancelledCount").innerHTML = appointments.filter(x=>x.status=="Cancelled").length;

               // ... (your existing counters code)
document.getElementById("cancelledCount").innerHTML =
    appointments.filter(x=>x.status=="Cancelled").length;


let html="";

const activeAppointments = appointments.filter(
    x => x.status === "Pending"
);

activeAppointments.forEach(a => {

    let badge = "bg-warning";

if(a.status === "Pending")
{
    badge = "bg-warning";
}
    // ... (rest of your existing badge logic and HTML template string stays exactly the same)

                    html += `
                    <tr>
                        <td>${a.id}</td>
                        <td>${a.fullName}</td>
                        <td>${a.contactNumber}</td>
                        <td>${new Date(a.appointmentDate).toLocaleDateString()}</td>
                        <td>${a.appointmentTime}</td>
                        <td>${a.purpose}</td>
                        <td>
                            <span class="badge ${badge}">${a.status}</span>
                        </td>
                        <td class="text-center">
                            <div class="dropdown">
                                <button class="btn btn-light btn-sm border" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item text-success" href="#" onclick="approveAppointment(${a.id})">
                                            <i class="bi bi-check-circle"></i> Approve
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item text-danger" href="#" onclick="cancelAppointment(${a.id})">
                                            <i class="bi bi-x-circle"></i> Cancel
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    `;
                });

                // Change appointments.length to activeAppointments.length here:
if(activeAppointments.length == 0){

    html=`
    <tr>
    <td colspan="8" class="text-center py-5">
    <i class="bi bi-calendar-x display-4"></i>
    <h5>No Schedule Enquiries</h5>
    </td>
    </tr>
    `;
}

document.getElementById("scheduleTableBody").innerHTML=html;

                document.getElementById("scheduleTableBody").innerHTML=html;
            }
            catch(error){
                console.log(error);
                alert("Cannot load appointments.");
            }
        }

        loadAppointments();

        // ===============================
        // APPROVE APPOINTMENT
        // ===============================
        async function approveAppointment(id){
            if(!confirm("Approve this appointment?")) {
                return;
            }

            try{
                const response = await fetch(
                    API_URL + "/approve/" + id,
                    { method:"PUT" }
                );

                if(response.ok) {
                    alert("Appointment Approved!");
                    loadAppointments();
                }
                else {
                    alert("Failed to approve appointment.");
                }
            }
            catch(error) {
                console.log(error);
                alert("Cannot connect to server.");
            }
        }

        // ===============================
        // CANCEL APPOINTMENT
        // ===============================
        async function cancelAppointment(id){
            if(!confirm("Are you sure you want to cancel this appointment?")) {
                return;
            }

            try{
                const response = await fetch(
                    API_URL + "/cancel/" + id,
                    { method:"PUT" }
                );

                if(response.ok) {
                    alert("Appointment Cancelled!");
                    loadAppointments();
                }
                else {
                    alert("Failed to cancel appointment.");
                }
            }
            catch(error) {
                console.log(error);
                alert("Cannot connect to server.");
            }
        }
