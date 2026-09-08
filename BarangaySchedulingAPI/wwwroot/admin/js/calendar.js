
        const APPOINTMENTS_API_URL = "/api/Appointments";
        const COMPLAINTS_API_URL = "/api/Complaints";
        
        let appointments = [];
        const today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let selectedDateString = null;

        async function loadAppointments() {
            try {
                const [apptsResponse, complaintsResponse] = await Promise.all([
                    fetch(APPOINTMENTS_API_URL).catch(() => null),
                    fetch(COMPLAINTS_API_URL).catch(() => null)
                ]);

                let apptsData = [];
                let complaintsData = [];

                if (apptsResponse && apptsResponse.ok) {
                    const rawAppts = await apptsResponse.json();
                    // Safe parsing with casing fallback protection
                    apptsData = rawAppts.filter(a => {
                        const status = a.status || a.Status;
                        return status === "Approved";
                    });
                }

                if (complaintsResponse && complaintsResponse.ok) {
                    const rawComplaints = await complaintsResponse.json();
                    
                    // Safe mapping supporting both camelCase and PascalCase from API payload
                    complaintsData = rawComplaints.map(c => ({
                        id: "complaint-" + (c.id || c.Id),
                        fullName: c.fullName || c.FullName || "Anonymous",
                        street: c.street || c.Street || "N/A",
                        contact: c.contact || c.Contact || "N/A",
                        appointmentDate: c.createdAt || c.CreatedAt, 
                        appointmentTime: "Submitted Case",
                        purpose: c.purpose || c.Purpose || "No Purpose Stated",
                        isLocalComplaint: true 
                    }));
                }

                // Combine into unified array
                appointments = [...apptsData, ...complaintsData];

            } catch (err) {
                console.error("Failed connecting to the backend application datasets: ", err);
                appointments = []; 
            }

            renderCalendar();
        }

        function renderCalendar() {
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            document.getElementById("monthTitle").innerHTML = months[currentMonth] + " " + currentYear;

            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            let html = "<tr>";

            // Add leading empty cells
            for (let i = 0; i < firstDay; i++) {
                html += "<td></td>";
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                // Filter items matching date (accounting for API property casing)
                const dayAppointments = appointments.filter(a => {
                    const apptDate = a.appointmentDate || a.AppointmentDate;
                    return apptDate && apptDate.substring(0, 10) === dateString;
                });
                
                const serverAppts = dayAppointments.filter(a => !a.isLocalComplaint);
                const localComplaintsCount = dayAppointments.filter(a => a.isLocalComplaint);

                let todayClass = "";
                if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    todayClass = "today";
                }

                // Apply dynamic highlight class if this day was previously selected
                const isSelected = dateString === selectedDateString ? "selected-day" : "";

                html += `
                <td class="calendar-day ${todayClass} ${isSelected}" data-date="${dateString}" onclick="handleDayClick(this, '${dateString}')">
                    <div class="day-number">${day}</div>
                    ${serverAppts.length > 0 ? `<span class="badge bg-success appointment-count">${serverAppts.length}</span>` : ""}
                    ${localComplaintsCount.length > 0 ? `<span class="badge bg-danger appointment-count">${localComplaintsCount.length}</span>` : ""}
                </td>`;

                if ((firstDay + day) % 7 === 0) {
                    html += "</tr><tr>";
                }
            }

            // Fill trailing empty cells to maintain proper table layout structures
            const totalCells = firstDay + daysInMonth;
            const remainingCells = (7 - (totalCells % 7)) % 7;
            for (let i = 0; i < remainingCells; i++) {
                html += "<td></td>";
            }

            html += "</tr>";
            document.getElementById("calendarBody").innerHTML = html;

            // Retain selection view details if active
            if (selectedDateString) {
                showAppointmentsAndComplaints(selectedDateString);
            }
        }

        function handleDayClick(element, dateString) {
            // Remove previous selection rings
            document.querySelectorAll(".calendar-day").forEach(el => el.classList.remove("selected-day"));
            
            // Highlight selected element
            element.classList.add("selected-day");
            selectedDateString = dateString;
            
            showAppointmentsAndComplaints(dateString);
        }

        function showAppointmentsAndComplaints(date) {
            const dayItems = appointments.filter(a => {
                const apptDate = a.appointmentDate || a.AppointmentDate;
                return apptDate && apptDate.substring(0, 10) === date;
            });
            
            const regularAppointments = dayItems.filter(a => !a.isLocalComplaint);
            const complaintItems = dayItems.filter(a => a.isLocalComplaint);

            // 1. Process regular structural appointment items
            let apptHtml = "";
            if (regularAppointments.length === 0) {
                apptHtml = `<div class="empty-message"><i class="bi bi-calendar-x display-6"></i><h6 class="mt-2">No standard appointments.</h6></div>`;
            } else {
                regularAppointments.forEach(a => {
                    const fullName = a.fullName || a.FullName || "Anonymous";
                    const time = a.appointmentTime || a.AppointmentTime || "No Time Set";
                    const purpose = a.purpose || a.Purpose || "No Purpose";
                    apptHtml += `
                    <div class="card mb-2 border-start border-success border-4 shadow-sm">
                        <div class="card-body py-2">
                            <h6>${escapeHTML(fullName)}</h6>
                            <p class="mb-1 small"><strong>Time:</strong> ${time}</p>
                            <p class="mb-0 small"><strong>Purpose:</strong> ${escapeHTML(purpose)}</p>
                        </div>
                    </div>`;
                });
            }
            document.getElementById("appointmentList").innerHTML = apptHtml;

            // 2. Process database complaint sections 
            let complaintHtml = "";
            if (complaintItems.length === 0) {
                complaintHtml = `<div class="empty-message"><i class="bi bi-shield-check display-6 text-muted"></i><h6 class="mt-2">No complaints filed for this date.</h6></div>`;
            } else {
                complaintItems.forEach(c => {
                    complaintHtml += `
                    <div class="card mb-2 border-start border-danger border-4 shadow-sm">
                        <div class="card-body py-2">
                            <h6 class="text-danger">${escapeHTML(c.fullName)}</h6>
                            <p class="mb-1 small"><strong>Address:</strong> ${escapeHTML(c.street)} | <strong>Contact:</strong> ${escapeHTML(c.contact)}</p>
                            <p class="mb-0 small bg-light p-2 rounded"><strong>Content:</strong> ${escapeHTML(c.purpose)}</p>
                        </div>
                    </div>`;
                });
            }
            document.getElementById("complaintsContainer").innerHTML = complaintHtml;
        }

        function escapeHTML(str) {
            if(!str) return '';
            return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
        }

        function previousMonth() { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); }
        function nextMonth() { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); }
        function goToToday() { currentMonth = today.getMonth(); currentYear = today.getFullYear(); renderCalendar(); }

        loadAppointments();
