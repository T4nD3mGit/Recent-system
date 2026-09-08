
const API_URL = "/api";

let calendar;

// ===========================
// LOAD CALENDAR
// ===========================

document.addEventListener("DOMContentLoaded", async function () {
const today = new Date().toISOString().split("T")[0];

document.getElementById("appointmentDate").min = today;
    calendar = new FullCalendar.Calendar(
        document.getElementById("calendar"),
        {

            initialView: "dayGridMonth",

            height: 650,

            selectable: true,

      dateClick:function(info){

    const today = new Date();
    today.setHours(0,0,0,0);

    if(info.date < today){
        alert("You cannot select a past date.");
        return;
    }

    document.getElementById("appointmentDate").value = info.dateStr;

    loadAvailableTimes(info.dateStr);
},

            events: loadAppointments

        });

    calendar.render();

});

// ===========================
// LOAD APPOINTMENTS
// ===========================
// ===========================
// LOAD AVAILABLE TIMES
// ===========================
async function loadAvailableTimes(date){

    const response = await fetch(API_URL + "/Appointments");

    const appointments = await response.json();

    const allTimes = [
        "8:00 AM",
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM"
    ];

    const select =
    document.getElementById("appointmentTime");

    select.innerHTML =
    '<option value="">Select Time</option>';

    allTimes.forEach(time=>{

        const count = appointments.filter(a=>

            a.appointmentDate.substring(0,10)==date &&
            a.appointmentTime==time

        ).length;

        if(count < 2){

            select.innerHTML +=
            `<option value="${time}">
                ${time} (${2-count} slot(s) left)
            </option>`;
        }

    });

}
async function loadAppointments(info, success, failure){

    try{

        const response =
        await fetch(API_URL + "/Appointments");

        const appointments =
        await response.json();

        const grouped = {};

        appointments
    .filter(a => a.status === "Approved")
    .forEach(a => {

        const date = a.appointmentDate.substring(0,10);

        if (!grouped[date]) {
            grouped[date] = 0;
        }

        grouped[date]++;

    });

        let events=[];

        for(const date in grouped){

            let count=grouped[date];

            events.push({

                title:
                count>=20 ?
                "FULL ("+count+"/20)" :
                count>=15 ?
                "Almost Full ("+count+"/20)" :
                count+" Appointment(s)",

                start:date,

                allDay:true,

                color:
                count>=20 ?
                "#dc3545" :
                count>=15 ?
                "#ffc107" :
                "#198754"

            });

        }

        success(events);

    }

    catch(error){

        console.log(error);

        failure(error);

    }

}

// ===========================
// OTHER PURPOSE
// ===========================

document.getElementById("purpose")
.addEventListener("change",function(){

    const other =
    document.getElementById("otherPurpose");

    if(this.value==="Other"){

        other.style.display="block";

        other.required=true;

    }

    else{

        other.style.display="none";

        other.required=false;

        other.value="";

    }

});
// ===========================
// LOAD AVAILABLE TIMES WHEN DATE CHANGES
// ===========================

document
.getElementById("appointmentDate")
.addEventListener("change", function () {

    loadAvailableTimes(this.value);

});
// ===========================
// CONTACT NUMBER VALIDATION
// ===========================

document.getElementById("contactNumber")
.addEventListener("input", function(){

    // Remove non numbers
    this.value = this.value.replace(/[^0-9]/g,'');

});


// Validate before submit

function validateContactNumber(){

    const contact =
    document.getElementById("contactNumber").value;


    const pattern = /^09[0-9]{9}$/;


    if(!pattern.test(contact)){

        alert(
        "Contact number must start with 09 and contain exactly 11 digits."
        );

        return false;

    }


    return true;

}
// ===========================
// SUBMIT APPOINTMENT
// ===========================

document.getElementById("appointmentForm")
.addEventListener("submit",submitAppointment);

async function submitAppointment(e){

    e.preventDefault();


    // CHECK CONTACT NUMBER FIRST

    if(!validateContactNumber()){

        return;

    }

    // ===========================
    // CONTACT NUMBER VALIDATION
    // ===========================

    let contactNumber =
    document.getElementById("contactNumber").value;


    if(!/^09[0-9]{9}$/.test(contactNumber)){


        alert(
            "Invalid contact number. Please enter exactly 11 digits starting with 09."
        );


        return;


    }



    let purpose=
    document.getElementById("purpose").value;

    if(purpose==="Other"){

        purpose=
        document.getElementById("otherPurpose").value;

    }

    const appointment={

        fullName:
        document.getElementById("fullName").value,

        contactNumber:
        document.getElementById("contactNumber").value,

        email:
        document.getElementById("email").value,

        purpose:purpose,

        appointmentDate:
        document.getElementById("appointmentDate").value,

        appointmentTime:
        document.getElementById("appointmentTime").value

    };

    try{

        const response=
        await fetch(API_URL+"/Appointments",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(appointment)

        });

        const result=
        await response.json();

if(response.ok){

    alert(result.message);

    document.getElementById("appointmentForm").reset();

    document.getElementById("otherPurpose").style.display = "none";

    document.getElementById("appointmentTime").innerHTML =
        '<option value="">Select Time</option>';

    calendar.refetchEvents();

}

        else{

            alert(result.message);

        }

    }

    catch(err){

        console.log(err);

        alert("Cannot connect to server.");

    }

}
