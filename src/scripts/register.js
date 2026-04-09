import { register } from "../utils/auth.js";

document.addEventListener("DOMContentLoaded", initRegister);

function initRegister() {
  const registerForm = document.getElementById("registerForm");
}
let loginBtn = document.querySelector("#loginBtn");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
let email = document.getElementById("email");
let password = document.getElementById("password");

if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    email = email.value;
    password = password.value;
    if (!email && !password) {
      return;
    }
    fetch("https://webbshop-2026-be-eight.vercel.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        console.log(res);
        const AccessToken = res.headers.get("Authorization");
        localStorage.setItem("AccessToken", AccessToken);
        const refreshToken = res.headers.get("X-Refresh-Token");
        localStorage.setItem("RefreshToken", refreshToken);
        console.log(AccessToken);
        return res.json();
      })
      .then((data) => {
        console.log("Login response:", data);
        localStorage.setItem("isAdmin", data.isAdmin);
        if (data.isAdmin) {
          window.location.href = "admin.html";
        } else {
          window.location.href = "index.html";
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
    console.log("Login:", { email, password });
  });
}

const toggleBtn = document.getElementById("toggleBtn");
const nameFields = document.getElementById("nameFields");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("registerBtn");

let isRegister = false;

toggleBtn.addEventListener("click", () => {
  isRegister = !isRegister;

  if (isRegister) {
    // Visa register
    nameFields.classList.remove("hidden");
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    toggleBtn.textContent = "Already have an account? Login";
  } else {
    // Visa login
    nameFields.classList.add("hidden");
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleBtn.textContent = "Don't have an account? Register";
  }
});
