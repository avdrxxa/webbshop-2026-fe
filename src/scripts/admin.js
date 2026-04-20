import { getEvents, createEvent } from "../utils/eventsApi.js";

const form = document.getElementById("createProductForm");
let loggautBtn= document.querySelector('.loggautBtn')
const tbody = document.getElementById("productsTableBody");
let deltagareLista = document.querySelector(".participants-wrap");
let kundregisterDiv= document.querySelector('.customer-registry-wrap')

loggautBtn.addEventListener('click', ()=>{
  localStorage.clear('AccessToken')
  localStorage.clear('RefreshToken')
  localStorage.clear('isAdmin')
})

document.addEventListener("DOMContentLoaded", loadEvents, loadKunder);

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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value, 10);
  const image = document.getElementById("image").value.trim();
  const slug = document.getElementById("slug").value.trim();

  try {
    await createEvent({ name, price, stock, image, slug });
    form.reset();
    loadEvents();
  } catch (err) {
    alert(err.message || "Failed to create product");
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


async function loadKunder() {
  try {
    let response = await fetch(
      "https://webbshop-2026-be-eight.vercel.app/api/users/",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: token,
        },
      }
    )
    if (!response.ok) {
      throw new Error('eoroor')
    }
    let users = await response.json()
    kundregisterDiv.innerHTML = ""
    if (!Array.isArray(users) || users.length === 0) {
      kundregisterDiv.innerHTML = "No users found"
      return
    }
    users.forEach((user) => {
      let card = createUserCard(user)
      kundregisterDiv.appendChild(card)
    });
    console.log(users)
  } catch (error) {
    console.error("Error med users:", error)
  }
}


function createUserCard(user) {
  const element = document.createElement("div")
  element.className = "elementUser"
  element.innerHTML = `
  <p>${user.firstname} ${user.lastname}</p>
  <div class="flex-row">
  <p>${user.email}</p>
  <p class=roleElement>${user.role}</p>
  </div>
  `;
  return element
}
