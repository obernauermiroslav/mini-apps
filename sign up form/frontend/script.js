/*
const signupForm = document.querySelector('#main-form');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#passwordConfirmation').value;

  if (!username || !email || !password || !confirmPassword) {
    alert('Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords don't match");
    return;
  }

  signupForm.submit();
});
*/

const signupForm = document.querySelector('#main-form');

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  postFirst();
});

function postFirst() {

  const username = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;

  fetch(`http://localhost:3000/signup`, {
    method: "POST",
    body: JSON.stringify({ username, email }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      if (response.ok) {
        console.log("Adding user to database");
      } else {
    
        console.error("Error adding user to database");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const facebookButton = document.querySelector(".facebook");

facebookButton.addEventListener("click", function() {
  window.location.href = "https://www.facebook.com/";
});

const twitterButton = document.querySelector('.twitter');

twitterButton.addEventListener('click', () => {
  window.location.href = 'https://twitter.com/';
});

const googleButton = document.querySelector('.google');

googleButton.addEventListener('click', () => {
  window.location.href = 'https://google.com/';
});
