const API = "/api/Announcement";

let allAnnouncements = [];

loadAnnouncements();

async function loadAnnouncements() {

    try {

        const response = await fetch(API);

        const announcements = await response.json();

        allAnnouncements = announcements;

        const container = document.getElementById("announcementList");

        container.innerHTML = "";

        if (announcements.length === 0) {

            container.innerHTML = `
                <div class="col-12 text-center">
                    <h4>No announcements available.</h4>
                </div>
            `;

            return;
        }

        announcements.forEach(a => {

            let image = "";

            if (a.imagePath) {

                image = `
                    <img src="/${a.imagePath}"
                         class="card-img-top"
                         style="height:220px;object-fit:cover;">
                `;

            }

            container.innerHTML += `

            <div class="col-lg-6">

                <div class="card shadow announcement-card h-100">

                    ${image}

                    <div class="card-body">

                        <span class="badge bg-primary">
                            ${a.category}
                        </span>

                        <h3 class="mt-3">
                            ${a.title}
                        </h3>

                        <p class="text-muted">

                            <i class="bi bi-calendar-event"></i>

                            ${new Date(a.eventDate).toLocaleDateString()}

                        </p>

                        <p>

                            ${a.description.substring(0,120)}...

                        </p>

                        <button
                            class="btn btn-primary"
                            onclick="showAnnouncement(${a.announcementId})">

                            Read More

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

function showAnnouncement(id) {

    const a = allAnnouncements.find(x => x.announcementId === id);

    if (!a) return;

    document.getElementById("modalTitle").textContent = a.title;

    document.getElementById("modalDate").textContent =
        new Date(a.eventDate).toLocaleDateString();

    document.getElementById("modalLocation").textContent =
        a.location;

    document.getElementById("modalDescription").textContent =
        a.description;

    const img = document.getElementById("modalImage");

    if (a.imagePath) {

        img.src = "/" + a.imagePath;

        img.style.display = "block";

    } else {

        img.style.display = "none";

    }

    new bootstrap.Modal(document.getElementById("readModal")).show();

}
