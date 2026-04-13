import { register } from "../utils/auth.js";

document.addEventListener("DOMContentLoaded", initRegister);

function initRegister() {
  const registerForm = document.getElementById("registerForm");
}
let isRegister = false;
let loginBtn = document.querySelector("#loginBtn");
//let fname = document.getElementById("fname");
//let lname = document.getElementById("lname");
//let email = document.getElementById("email");
//let password = document.getElementById("password");

function handleLogin() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
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
      } else if (data.isAdmin == false) {
        window.location.href = "index.html";
      } else if (data.isAdmin.status) {
        alert(
          "We couldn't find a user with that email or password, check your fields.",
        );
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert(
        "We couldn't find a user with that email or password, check your fields.",
      );
    });
  console.log("Login:", { email, password });
}

function handleRegister() {
  let firstname = document.getElementById("fname").value;
  let lastname = document.getElementById("lname").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  if (!email && !password && !fname && !fname) {
    return;
  }
  fetch("https://webbshop-2026-be-eight.vercel.app/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      firstname,
      lastname,
      email,
      password,
    }),
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
      if (data.error) {
        alert("Email already registered!");
        return;
      } else {
        alert("Du har skapat ett konto och kan logga in nu.");
        nameFields.classList.add("hidden");
        formTitle.textContent = "Login";
        loginBtn.textContent = "Login";
        toggleBtn.textContent = "Don't have an account? Register";
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
  console.log("Login:", {
    firstName: firstname,
    lastName: lastname,
    email,
    password,
  });
}

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (loginBtn.innerText == "Register") {
    console.log("register");
    handleRegister();
  } else {
    console.log("login");
    handleLogin();
  }
});

const toggleBtn = document.getElementById("toggleBtn");
const nameFields = document.getElementById("nameFields");
const formTitle = document.getElementById("formTitle");

toggleBtn.addEventListener("click", () => {
  isRegister = !isRegister;

  if (isRegister) {
    // Visa register
    nameFields.classList.remove("hidden");
    formTitle.textContent = "Register";
    loginBtn.textContent = "Register";
    toggleBtn.textContent = "Already have an account? Login";
  } else {
    // Visa login
    nameFields.classList.add("hidden");
    formTitle.textContent = "Login";
    loginBtn.textContent = "Login";
    toggleBtn.textContent = "Don't have an account? Register";
  }
});
