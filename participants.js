
document.addEventListener("DOMContentLoaded", loadParticipants);

    
    async function loadParticipants() {
  let participantsLista = document.querySelector(".participantsLista");
  let bookings = JSON.parse(localStorage.getItem("bookings")) || {users:[]};
  console.log(bookings);
  participantsLista.innerHTML = "";
  bookings.users.forEach((booking) => {
    const card = createEventCard(booking);
    participantsLista.appendChild(card);
  });
}

let avbokaDeltagare= async (booking) =>{
  let eventId= localStorage.getItem('eventId')
  let token = localStorage.getItem('AccessToken')
  let response= await fetch(`https://webbshop-2026-be-eight.vercel.app/api/events/${eventId}/bookings`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    credentials: "include",
    body: JSON.stringify({
        email: booking.email,
      }),
  })
  let data = await response.json()
  console.log(data)
  if (response.ok) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {users:[]}
    bookings.users = bookings.users.filter(b => b.email !== booking.email)
    localStorage.setItem("bookings", JSON.stringify(bookings))
  }
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
  element.querySelector(".avboka").addEventListener("click",async () => {
    console.log("Remove booking:", booking);
    await avbokaDeltagare(booking);
    loadParticipants()
  });
  return element;
}