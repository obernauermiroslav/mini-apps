const radioButtonDog = document.querySelector("#dog");
const radioButtonCat = document.querySelector("#cat");
const radioButtonTitan = document.querySelector("#titan");
const buttonSignUp = document.querySelector("#sign");
const buttonLoveCats = document.querySelector("#love");
const radioButtonYes = document.querySelector("#yes");
const radioButtonNo = document.querySelector("#no");

document.addEventListener("click", () => {
  if (radioButtonDog.checked || radioButtonCat.checked) {
    buttonSignUp.disabled = false;
  } else {
    buttonSignUp.disabled = true;
  }
  if (radioButtonTitan.checked && radioButtonNo.checked) {
    buttonSignUp.disabled = false;
  }
  if (radioButtonYes.checked) {
    buttonLoveCats.disabled = false;
  } else {
    buttonLoveCats.disabled = true;
  }
});

buttonLoveCats.addEventListener("click", () => {
  alert("Thank you, you've successfully signed up for cat facts");
});

buttonSignUp.addEventListener("click", () => {
  if (radioButtonTitan.checked && radioButtonNo.checked) {
    alert("Sigh, we still added you to the cat facts list");
  } else {
    alert("Thank you, you've successfully signed up for cat facts");
  }
});

function preLoad() {
  a1 = new Image();
  a1.src = "assets/dogs.jpg";
  a2 = new Image();
  a2.src = "assets/cats.jpg";
  a3 = new Image();
  a3.src = "assets/imperial-knight.jpg";
}
function im(image) {
  document.getElementById(image[0]).src = eval(image + ".src");
}
