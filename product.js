import { getBaseUrl } from "./src/utils/api.js"


const params = new URLSearchParams(window.location.search)
const id = params.get("id")
console.log("Selected event ID:", id)
async function getEventById(id){
    const url=new URL(`events/${id}`,getBaseUrl())
    let res= await fetch(url)
    if(!res.ok)throw new Error('Event not found')
        return res.json()
}
let trainers=[
    {
        name:'Michaela Mahal',
        image:'images/trainers/trainer1.jpg'
    },
    {
        name:'Elisa Kim',
        image:'images/trainers/trainer2.jpg'
    },
    {
        name:'Kimberly Andersson',
        image:'images/trainers/trainer3.jpg'
    }
]
function randomTränare(id){
    let key=`event-trainer-${id}`
    let sparadeTrainer=sessionStorage.getItem(key)
    if(sparadeTrainer){
        return JSON.parse(sparadeTrainer)
    }
    let trainer= trainers[Math.floor(Math.random()*trainers.length)]
    sessionStorage.setItem(key,JSON.stringify(trainer))
    return trainer
}

let imgCover= document.querySelector('.cover')
document.addEventListener("DOMContentLoaded", async()=>{
    const event = await getEventById(id)
    let trainer= randomTränare(id)
    const container = document.getElementById("event-detail")
    try{
        imgCover.src= sessionStorage.getItem('image')
        const date = new Date(event.time.date).toLocaleDateString("sv-SE")
        const time= event.time.startTime
        container.innerHTML = `
        <div class='heroInfo'>
            <div class='rowInfo'>
                <p>${date}</p>
                <p>${time}</p>
            </div>
            <h1>${event.title}</h1>
            <button class="add-to-cart-btn">Book now</button>
        </div>
        <div class='eventInfo'>
        <p>${event.description || "No description available"}</p>
        <div class='trainer'>
            <h2>TRAINER: ${trainer.name}</h2>
            <img class='trainerImg' src='${trainer.image}'>
        </div>
        <div class='sistaRad'>
            <div class='platser'>
                <img src='images/person icon.svg'> <h2>${(event.maxseats)-(event.seatsLeft)}/${event.maxseats}</h2>
            </div>
            <h2>$${event.price}</h2>
        </div>
        </div>
        `;

        const availableSeats = event.seatsLeft;
        const bookButtons = document.querySelectorAll(".add-to-cart-btn, .bookNow");
        const bookBtn = document.querySelector('.bookNow')

        if (availableSeats <= 0) {
            bookButtons.forEach(btn => {
                btn.disabled = true;
                btn.textContent = "Full";
                btn.classList.add("disabled-btn");
            });
        }

        bookBtn.addEventListener('click', () => {
            if (event.seatsLeft <= 0) {
                alert("This event is full booked");
                return;
            }

            formWrapper.classList.remove('hidden');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

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

            // save booking locally
            console.log("Booking saved locally");

            let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

            bookings.push({
                eventId: id,
                firstName,
                lastName,
                email,
                message
            });

            localStorage.setItem("bookings", JSON.stringify(bookings));

            event.seatsLeft--;
            console.log("Seats left:", event.seatsLeft); // to see when seats decreases

            //show how many are booked and max booked
            document.querySelector(".platser h2").textContent = `${event.maxseats - event.seatsLeft}/${event.maxseats}`;

            if (event.seatsLeft <= 0) {
                console.log("EVENT IS NOW FULL");

                bookButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.textContent = "Full";
                    btn.classList.add("disabled-btn");
                });
            }

            console.log("BOOKING CONFIRMED");
            console.log(document.querySelector(".platser h2")) //test
            console.log(event.maxseats, event.seatsLeft) //test

            confirmationBox.classList.remove("hidden");

            //formWrapper.classList.add('hidden')
        });
        
        container.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            formWrapper.classList.remove('hidden')
        });
    }catch(err){
        console.log(err)
        container.innerHTML = "<p>Failed to load event</p>"
    }
    
})

const bookBtn = document.querySelector('.bookNow')
const formWrapper = document.querySelector('.form-wrapper')
const form = document.querySelector('.form-component')
const confirmationBox = document.getElementById("confirmationBox")
const confirmationText = document.getElementById("confirmationText")
const sendBtn = document.getElementById("sendBookingBtn")
const closeBtns = document.querySelectorAll('.close-btn')

bookBtn.addEventListener('click', () => {
    formWrapper.classList.remove('hidden')
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("FORM SUBMITTED")

    confirmationBox.classList.remove("hidden");
})

formWrapper.addEventListener('click', (e) => {
    if (e.target === formWrapper) {
        formWrapper.classList.add('hidden')
    }
})

// Visa rutan
sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    confirmationText.innerHTML = `
    You have booked a place on the event:<br>
    <strong>xx @ $ xx</strong><br><br>
    Event ID:<br><br>
    For more information see profile; booked events 
    and on the email confirmation!
  `;

  confirmationBox.classList.remove("hidden");
});

// Stäng rutan med X

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    formWrapper.classList.add('hidden');
    confirmationBox.classList.add('hidden');
  });
});