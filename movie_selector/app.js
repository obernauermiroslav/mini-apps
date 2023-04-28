const selectGenres = document.getElementById("genre");
const selectMovie = document.getElementById("movie");
let selected = document.getElementById("selected");

const genres = [
  { name: "SciFi 🤖", id: 0 },
  { name: "Drama 🎭", id: 1 },
  { name: "Comedy 🤡", id: 2 },
];

const movies = [
  { name: "Moon 🌛", genreId: 0, id: 0 },
  { name: "2001: A Space Odyssey 🚀", genreId: 0, id: 1 },
  { name: "Contact 👽", genreId: 0, id: 2 },
  { name: "Darkest Hour ⬛", genreId: 1, id: 3 },
  { name: "There Will Be Blood 🩸", genreId: 1, id: 4 },
  { name: "American Beauty 🗽", genreId: 1, id: 5 },
  { name: "Airplane ✈️", genreId: 2, id: 6 },
  { name: "Deadpool 🦸‍♂️", genreId: 2, id: 7 },
  { name: "Wayne's World 🦇", genreId: 2, id: 8 },
];


selectGenres.onchange = () => {
  const genreId = Number(document.getElementById("genre").value);
  const genre = genres.find((genre) => genre.id === genreId);
  for(let i = 0; i < genres.length; i++)
 if(genreId === 0 ) {
  gif.src = "assets/scifi.gif";
 }else if (genreId === 1) {
  gif.src = "assets/drama.gif";
 }else{
  gif.src = "assets/comedy.gif";
 }
 genreSelect.innerText = `The selected genre🎬 is: ${genre.name}`;
};

selectMovie.onchange = () => {
  const movieId = Number(document.getElementById("movie").value);
  const movie = movies.find((movie) => movie.id === movieId);
  movieSelect.innerText = ` and the selected movie🎞️ is: ${movie.name} ...enjoy`;
  gif2.src = "assets/cine.gif";
  document.getElementById("gif2").style.zIndex = "1";
};

selectGenres.addEventListener("change", (event) => {
  const genreId = Number(event.target.value);
  selectMovie.replaceChildren();

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].genreId === genreId) {
      addElement(movies[i], "movie");
    }
  }
});
function addElement(option, selectId) {
  const selectGenre = document.getElementById(selectId);
  const optionElement = createOptionElement(option);
  selectGenre.appendChild(optionElement);
}

function createOptionElement(option) {
  const newOption = document.createElement("option");
  const newContent = document.createTextNode(option.name);
  newOption.appendChild(newContent);
  newOption.setAttribute("value", option.id);
  return newOption;
}

window.addEventListener("load", () => {
  for (let i = 0; i < genres.length; i++) {
    addElement(genres[i], "genre");
  }
  for (let j = 0; j < movies.length; j++) {
    addElement(movies[j], "movie");
  }
});
