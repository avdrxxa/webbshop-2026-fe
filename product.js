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

document.addEventListener("DOMContentLoaded", async()=>{
    const event = await getEventById(id)
    const container = document.getElementById("event-detail")
    try{
        const date = new Date(event.time.date).toLocaleDateString("sv-SE")
        const time= event.time.startTime
        container.innerHTML = `
        <h1>${event.title}</h1>
        <p>${date}</p>
        <p>${time}</p>
        <p>${event.description || "No description available"}</p>
        `;
    }catch(err){
        console.log(err)
        container.innerHTML = "<p>Failed to load event</p>"
    }
    
})


