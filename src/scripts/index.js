import { getEvents } from "../utils/eventsApi.js";

// TEMP: Default products for rendering when backend is unavailable

document.addEventListener("DOMContentLoaded", loadEvents);

async function loadEvents() {
  const eventsContainer = document.getElementById("events");
  eventsContainer.innerHTML = "<p>Loading events...</p>";

  try {
    const events = await getEvents();
    eventsContainer.innerHTML = "";
    const toRender = events.length > 0 ? events : TEMP_EVENTS;
    if (events.length === 0) {
      eventsContainer.dataset.temp = "true";
      const notice = document.createElement("p");
      notice.className = "temp-notice";
      notice.textContent = "Showing demos events (backend unavailable)";
      eventsContainer.appendChild(notice);
    }
    toRender.forEach((event) => {
      const eventCard = createEventCard(event);
      eventsContainer.appendChild(eventCard);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    eventsContainer.innerHTML = "";
    eventsContainer.dataset.temp = "true";
    const notice = document.createElement("p");
    notice.className = "temp-notice";
    notice.textContent = "Showing demo events (backend unavailable)";

  }
}

// Function to create an individual product card
function createEventCard(event) {
  const element = document.createElement("div");
  element.className = "product-card";
  const date = new Date(event.time.date).toLocaleDateString("sv-SE");
  const time = event.time.startTime;


  const imageSection = event.image
    ? `<img class="product-card__image" src="${event.image}" alt="${event.title}" loading="lazy" />`
    : `<div class="product-card__image-placeholder">🥬</div>`;

  element.innerHTML = `
    ${imageSection}
    <div class="product-card__body">
    <div class='flex' >
      <h3>${event.title}</h3>
      <p class="product-card__date">${date}</p>
      const date = new Date(event.time.date).toLocaleDateString();
      <p class="product-card__price">${time}</p>
    </div>
    <button class="add-to-cart-btn">See details</button>
    </div>
  `;

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
        window.location.href=`product.html?id=${event._id}`
  });

  return element;
}

console.log("DOM ready state:", document.readyState);
console.log("events div:", document.getElementById("events"));