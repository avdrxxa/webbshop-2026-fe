import { getEvents, createEvent } from "../utils/eventsApi.js";

const form = document.querySelector(".admin-create-event");
let loggautBtn= document.querySelector('.loggautBtn')
const tbody = document.getElementById("productsTableBody");
let deltagareLista = document.querySelector(".participants-wrap");
const archiveWrap = document.querySelector(".archive-wrap");
let token= localStorage.getItem('AccessToken')
let rtoken= localStorage.getItem('RefreshToken')

loggautBtn.addEventListener('click', ()=>{
  localStorage.clear('AccessToken')
  localStorage.clear('RefreshToken')
  localStorage.clear('isAdmin')
})

document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  loadArchivedEvents();
});

async function loadEvents() {
  try {
    const events = await getEvents();
    deltagareLista.innerHTML = "";
    const toRender =
      events && events.length > 0 ? events : console.log("error");
    let sortedEvents = events;
    sortedEvents.forEach((event, index) => {
      const card = createEventCard(event);
      deltagareLista.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

async function loadArchivedEvents() {
  try {
    const token = localStorage.getItem("AccessToken");

    console.log("TOKEN:", token);

    const res = await fetch(
      "https://webbshop-2026-be-eight.vercel.app/api/events/archive",
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("ARCHIVE DATA:", data);
    console.log("TOKEN:", token);

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch archive");
    }

    archiveWrap.innerHTML = "";

    // test different format
    let archiveList = [];

    if (Array.isArray(data)) {
      archiveList = data;
    } else if (Array.isArray(data.events)) {
      archiveList = data.events;
    } else if (Array.isArray(data.data)) {
      archiveList = data.data;
    } else {
      console.error("Okänt API-format:", data);
      archiveWrap.innerHTML = "<p>Fel dataformat från server</p>";
      return;
    }

    if (archiveList.length === 0) {
      archiveWrap.innerHTML = "<p>No completed events</p>";
      return;
    }

    archiveList.forEach(event => {
      const item = document.createElement("div");
      item.className = "elementList";

      item.innerHTML = `
        <p><strong>${event.title || "No title"}</strong></p>
        <p>${event.time?.date ? new Date(event.time.date).toLocaleDateString("sv-SE") : "No date"} 
        - ${event.time?.startTime || ""}</p>
        <p>${event.participants || 0}/${event.maxseats || 0} deltagare</p>
      `;

      archiveWrap.appendChild(item);
    });

  } catch (error) {
    console.error("Error fetching archive:", error);
    archiveWrap.innerHTML = "<p>Could not load archive</p>";
  }
}

let imagesLista = {
  gym: ["images/gym/gym1.jpg", "images/gym/gym3.svg", "images/gym/gym4.webp"],
  meditation: [
    "images/meditation/meditation1.jpg",
    "images/meditation/meditation2.jpg",
  ],
  outdoor: [
    "images/outdoor/outdoor1.jpg",
    "images/outdoor/outdoor2.jpg",
    "images/outdoor/outdoor3.jpg",
  ],
  pilates: ["images/pilates/pilates1.jpg", "images/pilates/pilates2.webp"],
  spa: ["images/spa/spa1.webp", "images/spa/spa2.jpeg", "images/spa/spa4.jpg"],
  yoga: [
    "images/yoga/yoga1.webp",
    "images/yoga/yoga2.jpg",
    "images/yoga/yoga3.webp",
  ],
};
let användaIndex = JSON.parse(localStorage.getItem("användaIndex")) || {};
function getEventsBilder(event) {
  let titel = event.title.toLowerCase();
  let kategory = "default";
  if (
    titel.includes("gym") ||
    titel.includes("training") ||
    titel.includes("power")
  ) {
    kategory = "gym";
  } else if (titel.includes("meditation")) {
    kategory = "meditation";
  } else if (titel.includes("outdoor")) {
    kategory = "outdoor";
  } else if (titel.includes("pilates")) {
    kategory = "pilates";
  } else if (titel.includes("spa")) {
    kategory = "spa";
  } else if (titel.includes("yoga")) {
    kategory = "yoga";
  } else {
    console.log("fel vid get eventsbilder func");
    return "images/default.jpg";
  }
  if (
    !användaIndex[kategory] &&
    användaIndex[kategory + "_shuffled"] === undefined
  ) {
    imagesLista[kategory] = [...imagesLista[kategory]].sort(
      () => Math.random() - 0.5,
    );
    användaIndex[kategory] = 0;
    användaIndex[kategory + "_shuffled"] = true;
  }
  let indexx = användaIndex[kategory] || 0;
  let image = imagesLista[kategory][indexx];
  användaIndex[kategory] = (indexx + 1) % imagesLista[kategory].length;
  localStorage.setItem("användaIndex", JSON.stringify(användaIndex));
  return image;
}

const trainerData = await fetch(
  "https://webbshop-2026-be-eight.vercel.app/api/users/trainers",
  {
    headers: {
      Authorization: token,
      "X-Refresh-Token": rtoken
    }
  }
);

const select = document.getElementById("trainer");
const data = await trainerData.json();
console.log(data);

data.forEach(trainer => {
  const option = document.createElement("option");

  option.value = trainer._id;
  option.textContent = `${trainer.firstname} ${trainer.lastname}`;

  select.appendChild(option);
});



form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value;
  const starttime = document.getElementById("starttime").value;
  const endtime = document.getElementById("endtime").value;
  const maxseats = parseInt(document.getElementById("maxseats").value, 10);
  const location = document.getElementById("location").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const trainerid = document.getElementById("trainer").value;

try {
  

  const res = await fetch("https://webbshop-2026-be-eight.vercel.app/api/events", {
    method: "POST",
    headers: {
            "Content-Type": "application/json",
            Authorization: token,
            "X-Refresh-Token": rtoken
        },
    credentials: "include",
    body: JSON.stringify({ 
      title,
      description,
      startTime: starttime,
      endTime: endtime,
      date,
      maxseats,
      location,
      price,
      trainerid,
    })
  });

  console.log(token);
  console.log(await res.json());

  if (!res.ok) {
    throw new Error("Failed to create event");
  }

  alert("Event skapad!");
  form.reset();
  loadEvents();

} catch (error) {
  console.error("Error creating event:", error);
  alert("Kunde inte skapa event");
}
});

function createEventCard(event) {
  const element = document.createElement("div");
  element.className = "elementList";
  const image = getEventsBilder(event) || "images/default.jpg";
  element.innerHTML = `
  <button class='seeEventInfo-Btn'>${event.title}</button>
  <div class="flex-row p-btn">
  <p>Booked seats: ${event.participants} av ${event.maxseats}</p>
  <a target="_blank" class='participantsBtn'>Participants</a>
  </div>
  `;
  element.querySelector(".seeEventInfo-Btn").addEventListener("click", () => {
    sessionStorage.setItem("image", image);
    window.location.href = `product.html?id=${event._id}`;
  });
  element
    .querySelector(".participantsBtn")
    .addEventListener("click", async () => {
      let eventId= JSON.stringify(localStorage.setItem('eventId', event._id))
      if (JSON.parse(localStorage.getItem("isAdmin"))) {
        let token = localStorage.getItem("AccessToken");
        let res = await fetch(
          `https://webbshop-2026-be-eight.vercel.app/api/events/${event._id}/bookings`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: token,
              
            },
          },
        );
        let bookings = await res.json();
        localStorage.setItem("bookings", JSON.stringify(bookings));
        console.log(bookings);
        window.location.href = `participants.html?id=${event._id}`;
      }
    });
  return element;
}
