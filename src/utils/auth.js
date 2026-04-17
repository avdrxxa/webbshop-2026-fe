import { getBaseUrl } from "./api.js";

export async function register( email, password) {
    const url = new URL("auth/register", getBaseUrl());
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

export async function auth() {
    let url= new URL ('auth/me', getBaseUrl())
    let res= await fetch(url, {
        method:'GET',
        credentials:'include',
        headers: {
            'Content-Type': 'application/json',
            Authentification: localStorage.getItem('AccessToken'),
            'X-Refresh-Token': localStorage.getItem('RefreshToken'),
        }
    })
    let json= await res.json()
    localStorage.setItem('loggedIn',await json.loggedIn)
    console.log('hej')
}

document.addEventListener("DOMContentLoaded", await auth);
