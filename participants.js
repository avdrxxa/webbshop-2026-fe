document.addEventListener("DOMContentLoaded", loadParticipants);

async function loadParticipants() {
  let participantsLista = document.querySelector(".participantsLista");
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  console.log(bookings);
  participantsLista.innerHTML = "";
  bookings.users.forEach((booking) => {
    const card = createEventCard(booking);
    participantsLista.appendChild(card);
  });
}

function createEventCard(booking) {
  const element = document.createElement("div");
  element.className = "liParticipants";
  element.innerHTML = `
        <div class="flex-row">
            <p>${booking.firstname} ${booking.lastname} <br>${booking.email} </p>
            <button class='avboka'>Avboka</button>
        </div>
        `;
  element.querySelector(".avboka").addEventListener("click", () => {
    console.log("Remove booking:", booking);
  });
  return element;
}
