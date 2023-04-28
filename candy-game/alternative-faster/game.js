// - Gather 10.000 candies!
// - Clicking the ‘Create candies’ button gives you 1 candy.
// - You can buy a lollipop for 100 candies by clicking the ‘Buy lollipop’ button.
// - 10 lollipops generate 1 candy per second.
//   - Use the 🍭 emoji to display the lollipops you have
// - Display the candy producton rate in the `Candies / Second` row
// - If you press the "make candy rain" button, the candy generation should speed up 10x

const candyCreate = document.querySelector(".create-candies");
const candies = document.querySelector(".candies");
let lollypops = document.querySelector(".lollypops");
let buyLollypop = document.querySelector(".buy-lollypops");
let generation = document.querySelector(".speed");
let candyRain = document.querySelector(".candy-machine");
let counter = 0;
let lolli = 0;
let speed = 0;

candyCreate.addEventListener("click", function () {
  candies.innerText = counter += 10;
});

buyLollypop.addEventListener("click", function () {
  if (counter >= 10) {
    lolli += 1;
    lollypops.innerText = `🍭: ${lolli}`;
    candies.innerText = counter -= 10;
  }
});

let myInterval = setInterval(function () {
  if (lolli >= 10) {
    candyRain.disabled = false;
    candies.innerText = counter += 10;
    generation.innerText = speed + 10;
    if (candies.innerText > 10000) {
      clearInterval(myInterval);
      alert(`Wait, let's count them...
      Okay, we have ${candies.innerText} candies...
      OMG...that's even more than we were supposed to get...
      strange...usually it takes longer...hmmm...wait!...
      you surely were using the third button right?...but still...
      Mission completed!!!`);
    }
  }
}, 1000);

candyRain.addEventListener("click", function () {
  setInterval(function () {
    counter = counter += 100;
  }, 1000);
  generation.innerText = speed += 100;
  alert(`Hey, that's cheating...you are supposed to get 10 000 candies 
  'the hard way'(you have to use the 'create candies' and 'buy lollypops' buttons only), 
  so be so kind and stop using this button ok? `)
});