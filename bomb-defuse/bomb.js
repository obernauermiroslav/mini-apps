let defuse = document.querySelector("button");
let countdown = document.querySelector(".display");
let time = 10;

let timer = setInterval(() => {
  time -= 1;
  countdown.textContent = `${time}`;

  if (time === 0) {
    countdown.textContent = "Bomb exploded";
    explosion();
    clearInterval(timer);
  }
}, 1000);

function explosion()
{
var img = document.getElementById("image");
img.src="exploded.jpg";
img.style.borderColor = "black"

}

function stop() {
  countdown.textContent = "Bomb defused";
  clearInterval(timer);
  diffusion()
}

function diffusion()
{
var img = document.getElementById("image");
img.src="defused.jpg";
img.style.borderColor = "green"

}

let myOnClick = function () {};
defuse.onclick = stop;


