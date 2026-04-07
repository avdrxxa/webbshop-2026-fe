import { getBaseUrl } from "./api.js";

export async function getEvents() {
  const url = new URL("events", getBaseUrl())
  console.log("Fetching from:", url.toString())
  try {
    const response = await fetch(url)
    //, {METHOD: 'GET', credentials:'include'}
    console.log("Status:", response.status)
    if (!response.ok) {
      console.error("Fetch failed");
      return [];
    }
    const data = await response.json();
    console.log("Received data:", data.events);
    return data.events;
  } catch (err) {
    console.error("Network error:", err);
    return [];
  }
}

export async function createEvent(event) {
  const url = new URL("events", getBaseUrl());
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (response.ok) {
    return response.json();
  }
  const err = await response.json().catch(() => ({}));
  throw new Error(err.errors?.[0]?.msg || "Failed to create event");
}