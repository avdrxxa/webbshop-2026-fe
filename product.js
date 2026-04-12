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
    }catch(err){
        console.log(err)
        container.innerHTML = "<p>Failed to load event</p>"
    }
    
})

const bookBtn = document.querySelector('.bookNow')
const formWrapper = document.querySelector('.form-wrapper')
const form = document.querySelector('.form-component')

bookBtn.addEventListener('click', () => {
    formWrapper.classList.remove('hidden')
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("FORM SUBMITTED")
    
    // bokningslogik

    formWrapper.classList.add('hidden')
})

formWrapper.addEventListener('click', (e) => {
    if (e.target === formWrapper) {
        formWrapper.classList.add('hidden')
    }
})