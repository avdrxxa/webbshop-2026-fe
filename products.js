import { getEvents } from "./src/utils/eventsApi.js"

let imagesLista = {
    gym: ['images/gym/gym1.jpg', 'images/gym/gym3.svg', 'images/gym/gym4.webp'],
    meditation: ['images/meditation/meditation1.jpg', 'images/meditation/meditation2.jpg'],
    outdoor: ['images/outdoor/outdoor1.jpg', 'images/outdoor/outdoor2.jpg', 'images/outdoor/outdoor3.jpg'],
    pilates: ['images/pilates/pilates1.jpg', 'images/pilates/pilates2.webp'],
    spa: ['images/spa/spa1.webp', 'images/spa/spa2.jpeg', 'images/spa/spa4.jpg'],
    yoga: ['images/yoga/yoga1.webp', 'images/yoga/yoga2.jpg', 'images/yoga/yoga3.webp']
}

function getUpcoming(events) {
    const now = new Date()
    return events.filter(event => new Date(event.time.date) >= now)
}

function getEventsBilder(event) {
    let sparadeKey = `event-image-${event._id}`
    let sparadeImage = localStorage.getItem(sparadeKey)
    if (sparadeImage) return sparadeImage
    let titel = event.title.toLowerCase()
    let kategory = 'default'
    if (titel.includes('gym') || titel.includes('training') || titel.includes('power')) {
        kategory = 'gym'
    } else if (titel.includes('meditation')) {
        kategory = 'meditation'
    } else if (titel.includes('outdoor')) {
        kategory = 'outdoor'
    } else if (titel.includes('pilates')) {
        kategory = 'pilates'
    } else if (titel.includes('spa')) {
        kategory = 'spa'
    } else if (titel.includes('yoga')) {
        kategory = 'yoga'
    } else {
        return 'images/default.jpg'
    }
    let images = imagesLista[kategory]
    let randImage = images[Math.floor(Math.random() * images.length)]
    localStorage.setItem(sparadeKey, randImage)
    return randImage
}

function createEventCard(event) {
    const element = document.createElement("div")
    element.className = "product-card"
    const date = new Date(event.time.date).toLocaleDateString("sv-SE")
    const time = event.time.startTime
    const image = getEventsBilder(event) || 'images/default.jpg'
    let imageSection = image
        ? `<img class="product-card__image" src="${image}" alt="${event.title}" loading="lazy" />`
        : `<div class="product-card__image-placeholder">:)</div>`
    element.innerHTML = `
        ${imageSection}
        <div class="product-card__body">
            <div class='flex'>
                <h3>${event.title}</h3>
                <p class="product-card__date">${date}</p>
                <p class="product-card__price">${time}</p>
            </div>
            <button class="add-to-cart-btn">See details</button>
        </div>
    `
    element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
        sessionStorage.setItem('image', image)
        window.location.href = `product.html?id=${event._id}`
    });
    return element;
}

async function loadEvents() {
    const eventsContainer = document.getElementById("events");
    const searchBar = document.querySelector('.search-bar')
    eventsContainer.innerHTML = "<p>Loading events...</p>";
    try {
        const events = await getEvents()
        let searchBarValue = searchBar.value.toLowerCase()
        let filtreradeEvents = events.filter(event =>  
            event.title.toLowerCase().includes(searchBarValue)
        )
        let toRender = filtreradeEvents.length > 0 ? filtreradeEvents : events
        eventsContainer.innerHTML = ''
        toRender.forEach((event) => {
            eventsContainer.appendChild(createEventCard(event))
        });
    } catch (error) {
        console.error("Error fetching events:", error)
        eventsContainer.innerHTML = "<p>Could not load events.</p>"
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let searchBar = document.querySelector('.search-bar')
    let filterBtn = document.querySelector('.flex1 div img.iconFilter')
    let filterForm = document.querySelector('.filter-form')
    let submitForm = document.querySelector('.filter-form .submit')
    let dateValue = document.querySelector('#date')
    let kategoryValue = document.querySelector('#category')
    filterBtn.addEventListener('click', () => {
        filterForm.classList.toggle('active')
    })
    searchBar.addEventListener('input', () => {
        loadEvents()
    })
    submitForm.addEventListener('click', async () => {
        const eventsContainer = document.getElementById("events")
        eventsContainer.innerHTML = "<p>Loading events...</p>"
        let events = await getEvents()
        let dateVal = dateValue.value
        let kategoryVal = kategoryValue.value.toLowerCase()
        let filtreradeEvents = getUpcoming(events)
        if (dateVal != 'yyyy-mm-dd' && dateVal != '') {
            filtreradeEvents = filtreradeEvents.filter(event =>
                new Date(event.time.date).toLocaleDateString("sv-SE").includes(dateVal)
            )
        }
        if (kategoryVal != 'all') {
            filtreradeEvents = filtreradeEvents.filter(event =>
                event.title.toLowerCase().includes(kategoryVal)
            )
        }
        let toRender = filtreradeEvents.length > 0 ? filtreradeEvents : events
        eventsContainer.innerHTML = ''
        toRender.forEach((event) => {
            eventsContainer.appendChild(createEventCard(event))
        })
        filterForm.classList.toggle('active')
    })
    loadEvents()  
})
