import { register } from "../utils/auth.js";

document.addEventListener("DOMContentLoaded", initRegister);

function initRegister() {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleRegister();
  });
}
let registerBtn=document.querySelector('#registerBtn')
let loginBtn=document.querySelector('#LoginBtn')

function handleRegister() {
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // TODO: Call register API when backend is ready
  fetch('https://webbshop-2026-be-eight.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({email:'admin@example.com', password:'Admin123!'})
      })
      .then(res => res.json())
      .then(data => {
      console.log('Login response:', data);
      })
      .catch(err => {
      console.error('Error:', err);
  });
  console.log("Login:", { email, password });
  window.location.href='admin.html'
}

registerBtn.addEventListener('click',()=>{
  if (fname&&lname&&email&&password){
    fetch('https://webbshop-2026-be-eight.vercel.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({email, password})
      })
      .then(res => res.json())
      .then(data => {
      console.log('Register response:', data);
      })
      .catch(err => {
      console.error('Error:', err);
  });
  console.log("Register:", { email, password });
  alert("Registration functionality not implemented yet");
  }else{
    console.log('fel')
  }
})
if (loginBtn){
  loginBtn.addEventListener('click',()=>{
    if (!email&&!password){return}
    fetch('https://webbshop-2026-be-eight.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      credentials: 'include',
      body: JSON.stringify({email, password})
    })
    .then(res => res.json())
    .then(data => {
      console.log('Login response:', data);
    })
    .catch(err => {
      console.error('Error:', err);
      console.log('fel')
    })
    console.log("Login:", { email, password });
  })
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