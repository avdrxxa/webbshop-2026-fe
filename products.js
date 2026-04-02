import { getEvents } from "./src/utils/eventsApi.js";

let searchBar= document.querySelector('.search-bar')
let filterBtn= document.querySelector('.flex1 div img.iconFilter')
let filterForm= document.querySelector('.filter-form')
let submitForm= document.querySelector('.filter-form .submit')

filterBtn.addEventListener('click', () => {
    filterForm.classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", loadEvents);

let imagesLista={
    gym:[
        'images/gym/gym1.jpg',
        'images/gym/gym3.svg',
        'images/gym/gym4.webp',
    ],
    meditation:[
        'images/meditation/meditation1.jpg',
        'images/meditation/meditation2.jpg',
    ],
    outdoor:[
        'images/outdoor/outdoor1.jpg',
        'images/outdoor/outdoor2.jpg',
        'images/outdoor/outdoor3.jpg',
    ],
    pilates:[
        'images/pilates/pilates1.jpg',
        'images/pilates/pilates2.webp',
    ],
    spa:[
        'images/spa/spa1.webp',
        'images/spa/spa2.jpeg',
        'images/spa/spa4.jpg',
    ],
    yoga:[
        'images/yoga/yoga1.webp',
        'images/yoga/yoga2.jpg',
        'images/yoga/yoga3.webp',
    ]
}
let användaIndex={}
function getEventsBilder(event){
    let titel=event.title.toLowerCase()
    let kategory='default'
    if(titel.includes('gym')||titel.includes('training')||titel.includes('power')){
        kategory='gym'
    }else if(titel.includes('meditation')){
        kategory='meditation'
    }else if(titel.includes('outdoor')){
        kategory='outdoor'
    }else if(titel.includes('pilates')){
        kategory='pilates'
    }else if(titel.includes('spa')){
        kategory='spa'
    }else if(titel.includes('yoga')){
        kategory='yoga'
    }else{
        console.log('fel vid get eventsbilder func')
        return 'images/default.jpg'
    }
    let images=imagesLista[kategory]
    if(!användaIndex[kategory]){
        användaIndex[kategory]=0
        imagesLista[kategory]=images.sort(()=> Math.random()-0.5)
    }
    let indexx=användaIndex[kategory]
    let image=images[indexx]
    användaIndex[kategory]=(indexx+1)%images.length
    return image
}

async function loadEvents() {
    const eventsContainer = document.getElementById("events");
    eventsContainer.innerHTML = "<p>Loading events...</p>";

    try {
        const events = await getEvents();
        eventsContainer.innerHTML = "";
        const toRender = events.length > 0 ? events : console.log('error');
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
    const image = getEventsBilder(event)|| 'images/default.jpg'
    let imageSection= image
        ? `<img class="product-card__image" src="${image}" alt="${event.title}" loading="lazy" />`
        : `<div class="product-card__image-placeholder">:)</div>`;

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
        sessionStorage.setItem('image',image)
        window.location.href=`product.html?id=${event._id}`
    });

    return element;
}