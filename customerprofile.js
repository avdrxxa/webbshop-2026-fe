// har skapat funktionalitet som funkar för varje sida när 
// man trcyker på profile om man är inloggad
// den ligger i loggaut.js
import {auth} from "./src/utils/auth.js";

async function renderBookedEvents() {
  const container = document.querySelector(".booked-events-list");
  container.innerHTML = "";
  const token = localStorage.getItem("AccessToken");

  try {
    const response = await fetch("https://webbshop-2026-be-eight.vercel.app/api/auth/bookings", {
        headers: {
            "Authorization": token,
        }
    });

    const data = await response.json();

    console.log(data); // see struktur the first time
    data.forEach(event => {
      const div = document.createElement("div");
      div.className = "booked-events-items";

      div.innerHTML = `
        <h6 class="h6-costumer-profile">${event.eventId.title || "No title"}</h6>
        <button class="button-booked-events-items">MORE INFORMATION</button>
      `;

      let eventLocation = event.eventId._id;
      div.querySelector(".button-booked-events-items").addEventListener("click", () => {
        window.location.href=`product.html?id=${eventLocation}`
      })

      container.appendChild(div);
    });

  } catch (error) {
    console.error("Wrong when getting events:", error);
  }
}

export async function renderProfile () {
    const container = document.querySelector(".profile-info");

    try {
        const user = await auth();
        console.log(user);

        container.innerHTML = `
        <p><strong>First name:</strong> ${user.firstname}</p>
        <p><strong>Last name:</strong> ${user.lastname}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        `;
        
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}

renderBookedEvents();
renderProfile();