import { getBaseUrl } from "./src/utils/api.js";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log("Selected event ID:", id);
async function getEventById(id) {
  const url = new URL(`events/${id}`, getBaseUrl());
  let res = await fetch(url);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}
let trainers = [
  {
    name: "Michaela Mahal",
    image: "images/trainers/trainer1.jpg",
  },
  {
    name: "Elisa Kim",
    image: "images/trainers/trainer2.jpg",
  },
  {
    name: "Kimberly Andersson",
    image: "images/trainers/trainer3.jpg",
  },
];
function randomTränare(id) {
  let key = `event-trainer-${id}`;
  let sparadeTrainer = sessionStorage.getItem(key);
  if (sparadeTrainer) {
    return JSON.parse(sparadeTrainer);
  }
  let trainer = trainers[Math.floor(Math.random() * trainers.length)];
  sessionStorage.setItem(key, JSON.stringify(trainer));
  return trainer;
}

let imgCover = document.querySelector(".cover");
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("AccessToken");

  if (!token) {
    document.querySelectorAll(".add-to-cart-btn, .bookNow").forEach((btn) => {
      btn.disabled = true;
      btn.textContent = "Login to book";
    });
  }

  const event = await getEventById(id);
  let trainer = randomTränare(id);
  const container = document.getElementById("event-detail");
  try {
    imgCover.src = sessionStorage.getItem("image");
    const date = new Date(event.time.date).toLocaleDateString("sv-SE");
    const time = event.time.startTime;
    container.innerHTML = `
        <div class='heroInfo'>
            <div class='rowInfo'>
                <p>${date}</p>
                <p>${time}</p>
            </div>
            <h1>${event.title}</h1>
            <button class="add-to-cart-btn booknowBtn">Book now</button>
        </div>
        <div class='eventInfo'>
        <p>${event.description || "No description available"}</p>
        <div class='trainer'>
            <h2>TRAINER: ${trainer.name}</h2>
            <img class='trainerImg' src='${trainer.image}'>
        </div>
        <div class='sistaRad'>
            <div class='platser'>
                <img src='images/person icon.svg'> <h2>${event.maxseats - event.seatsLeft}/${event.maxseats}</h2>
            </div>
            <h2>$${event.price}</h2>
        </div>
        </div>
        `;
    container.querySelector(".booknowBtn").addEventListener("click", () => {
      formWrapper.classList.remove("hidden");
    });

    const availableSeats = event.seatsLeft;
    const bookButtons = document.querySelectorAll(".add-to-cart-btn, .bookNow");
    const bookBtn = document.querySelector(".bookNow");

    if (availableSeats <= 0) {
      bookButtons.forEach((btn) => {
        btn.disabled = true;
        btn.textContent = "Full";
        btn.classList.add("disabled-btn");
      });
    }

    console.log("TOKEN:", token);

    bookBtn.addEventListener("click", () => {
      const token = localStorage.getItem("AccessToken");

      if (!token) {
        alert("You must be logged in to book");
        return;
      }

      if (event.seatsLeft <= 0) {
        alert("This event is full booked");
        return;
      }

      formWrapper.classList.remove("hidden");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const accessToken = localStorage.getItem("AccessToken");
      const refreshToken = localStorage.getItem("RefreshToken");

      if (!accessToken) {
        alert("You must login again");
        return;
      }

      if (event.seatsLeft <= 0) return; // avoid dubble booking in UI

      const firstName = document.querySelector("#firstname").value;
      const lastName = document.querySelector("#lastname").value;
      const email = document.querySelector("#email").value;
      const message = document.querySelector("#textarea").value;

      //validation
      if (!firstName || !lastName || !email) {
        alert("Please fill in all required fields");
        return;
      }

      try {
        /* const token = localStorage.getItem("Bearerqwerty1234"); */
        const accessToken = localStorage.getItem("AccessToken");

        const response = await fetch(
          `https://webbshop-2026-be-eight.vercel.app/api/events/${event._id}/bookings`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Refresh-Token": refreshToken,
              "Content-Type": "application/json",
              /* "Content-Type": "application/json", */
              /* Authorization: `Bearer ${token}`, */
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              message,
            }),
          },
        );

        /* if (!response.ok) throw new Error("Booking failed"); */

        console.log("BOOKING SAVED IN DATABASE");

        // Get updated event from backend
        const updatedEvent = await getEventById(id);

        // Show confirmation with real data
        showConfirmation(updatedEvent);

        // Update UI with real data
        document.querySelector(".platser h2").textContent =
          `${updatedEvent.maxseats - updatedEvent.seatsLeft}/${updatedEvent.maxseats}`;

        if (updatedEvent.seatsLeft <= 0) {
          bookButtons.forEach((btn) => {
            btn.disabled = true;
            btn.textContent = "Full";
            btn.classList.add("disabled-btn");
          });
        }

        await loadMyBookings();
      } catch (error) {
        console.error(error);
        alert("Booking failed");
        return;
      }

      if (event.seatsLeft <= 0) {
        console.log("EVENT IS NOW FULL");

        bookButtons.forEach((btn) => {
          btn.disabled = true;
          btn.textContent = "Full";
          btn.classList.add("disabled-btn");
        });
      }

      console.log("BOOKING CONFIRMED");
      console.log(document.querySelector(".platser h2")); //test
      console.log(event.maxseats, event.seatsLeft); //test
      console.log(event.seatsLeft);
      /* console.log("TOKEN USED:", token); */

      if (!token) {
        alert("Session expired, please login again");
        return;
      }

      //confirmationBox.classList.remove("hidden");

      form.reset();
      formWrapper.classList.add("hidden");
    });

    await loadMyBookings();
  } catch (err) {
    console.log(err);
    container.innerHTML = "<p>Failed to load event</p>";
  }
});

async function loadMyBookings() {
  /* const token = localStorage.getItem("Bearerqwerty1234"); */
  const accessToken = localStorage.getItem("AccessToken");
  const refreshToken = localStorage.getItem("RefreshToken");

  console.log("AccessToken:", localStorage.getItem("AccessToken"));
  console.log("RefreshToken:", localStorage.getItem("RefreshToken"));

  if (!accessToken) return;

  const res = await fetch(
    "https://webbshop-2026-be-eight.vercel.app/api/events/my/bookings",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
        "Content-Type": "application/json",
        /* Authorization: `Bearer ${token}` */
      },
    },
  );

  if (!res.ok) return;

  /* if (!res.ok) {
        console.log("Failed to fetch bookings");
        return;
    } */

  console.log("BOOKING SAVED IN DATABASE");

  const bookings = await res.json();

  console.log("MY BOOKINGS:", bookings);

  const bookingCount = bookings.length;

  const info = document.createElement("p");
  info.textContent = `You have booked ${bookingCount} events`;

  document.body.appendChild(info);
}

const formWrapper = document.querySelector(".form-wrapper");
const form = document.querySelector(".form-component");

formWrapper.addEventListener("click", (e) => {
  if (e.target === formWrapper) {
    formWrapper.classList.add("hidden");
  }
});

const closeBtn = document.querySelector(".close-btn");

closeBtn.addEventListener("click", () => {
  formWrapper.classList.add("hidden");
});

// Funktion för att visa bekräftelserutan med eventdata
function showConfirmation(eventData) {
  const confirmationBox = document.getElementById("confirmationBox");

  const date = new Date(eventData.time.date).toLocaleDateString("sv-SE");
  const time = eventData.time.startTime;

  confirmationBox.querySelector("strong").textContent =
    `${eventData.title} on ${date} at ${time}`;

  confirmationBox.classList.remove("hidden");
}

sendBtn.disabled = true;
sendBtn.textContent = "Booking...";

// Stäng bekräftelserutan
const confirmationBox = document.getElementById("confirmationBox");
const closeBtn = document.getElementById("closeBtn");

closeBtn.addEventListener("click", () => {
  confirmationBox.classList.add("hidden");
});
