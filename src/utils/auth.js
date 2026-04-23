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
    let token= localStorage.getItem('AccessToken')
    let rtoken= localStorage.getItem('RefreshToken')
    console.log(token, rtoken)
    let url= new URL ('auth/me', getBaseUrl())
    let res= await fetch(url, {
        method:'GET',
        credentials:'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            'X-Refresh-Token': rtoken,
        }
    })
    let json= await res.json()
    console.log(json)
    localStorage.setItem('userId', json._id)
    localStorage.setItem('loggedIn',await json.roles)
    console.log('hej')
}

document.addEventListener("DOMContentLoaded", await auth);
