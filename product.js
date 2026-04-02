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
let imgCover= document.querySelector('.cover')
document.addEventListener("DOMContentLoaded", async()=>{
    const event = await getEventById(id)

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
            <h2>TRAINER: ${event.trainer}</h2>
            <img class='trainerImg' src=''>
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


