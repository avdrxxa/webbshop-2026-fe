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
