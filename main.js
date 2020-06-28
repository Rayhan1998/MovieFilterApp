// Movie database notes

// var allgeres = https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&language=en-US

//  for searching only link https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${search}

var APIKEY = "6ee25636d25df9899ed46e80a13383ff";
var imageTemplate = "https://image.tmdb.org/t/p/w300";
var movieIdlink = `https://api.themoviedb.org/3/movie/343611?api_key=${APIKEY}`;
var page = 1;
// liked movies thats added to watchlist
let clonedTag = undefined;
var allClones = [];
var watchListBody = document.querySelector(".watchlist-body");
var watchList = document.querySelector(".watchlist");
var watchListInner = document.querySelector(".watchList-inner");
// close button to close watchlist
var closeWatchList = document.querySelector(".delete");
var movieId;

var form = document.querySelector(".search-form");
var input = document.querySelector(".input");
var genre = document.querySelector(".genre");
var opt = document.createElement("option");
var years = document.querySelector(".year");
var body = document.querySelector("body");

var contain = document.querySelector(".contain");
var id = 0;
var popUpCardContainer = document.querySelector(".middle-container");
var arrowBack = document.querySelector(".back");
var arrowForward = document.querySelector(".forward");
var pageIndicator = document.querySelector(".bottom-indicator");
// card is the popup that displays after clicking more infor
let card = document.createElement("div");
// random 1 and 2 is used for genredata and year list to display movies
let randomNumber;
let randomNumber2;
var genredata = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

var yearsList = [
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020
];
// calls random one and two
let random = () => {
  randomNumber = Math.floor(Math.random() * genredata.length);
  randomNumber2 = Math.floor(Math.random() * yearsList.length);
};
random();
// Loops through genre data and sets options for select element
genredata.forEach(elem => {
  var opt = document.createElement("option");
  opt.value = elem.id;
  opt.textContent = elem.name;
  genre.appendChild(opt);
});

// function to fetch movies from API
async function getMovies(genres, year) {
  let response = await axios
    .get(
      ` https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&with_genres=${genres}&primary_release_year=${year}&sort_by=popularity.desc&page=${page}`
    )
    .catch(res => {
      console.log("error");
    });

  // displays movies in DOM

  movieDomCreator(response.data.results);

  console.log(response.data.results);
  return response.data.results;
}
// request movies (Movies that displays on load screen)
getMovies(genredata[randomNumber].id, yearsList[randomNumber2]);

// second request to get more details on a specific movie when clicking more info
async function getMoreDetails() {
  let responce = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}`
  );

  popUpCardInfo(responce.data);
}

// form submits data to fetch movies from API
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  if (genre.value != "" && years.value != "") {
    getMovies(genre.value, years.value);
    contain.innerHTML = "";
  }
});

// Creates movie boxes for DOM
function movieDomCreator(movie) {
  movie.forEach(elem => {
    var div = document.createElement("div");

    div.classList.add("box");
    div.id = `${id}`;
    var img = document.createElement("img");
    var p = document.createElement("p");
    var heart = document.createElement("i");
    heart.classList.add("heart");

    var moreInfo = document.createElement("btn");
    moreInfo.classList.add("button");
    moreInfo.classList.add("is-primary");
    moreInfo.textContent = "More Info";

    heart.classList.add("far");
    heart.classList.add("fa-heart");

    p.textContent = elem.title;

    if (elem.poster_path != undefined) {
      img.src = `${imageTemplate}${elem.poster_path}`;
    } else {
      img.src = "not found";
    }
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(moreInfo);
    div.appendChild(heart);
    contain.appendChild(div);
    id++;

    moreInfo.addEventListener("click", function() {
      movieId = elem.id;
      getMoreDetails();
      console.log("card");
    });
  });

  // Corner hearts inside box
  var hearts = document.querySelectorAll(".heart");

  hearts.forEach(function(heart) {
    heart.addEventListener("click", function(e) {
      if (!heart.classList.contains("fontScale")) {
        heart.classList.add("fontScale");
        clonedTag = heart.parentNode.cloneNode(true);

        // appending each liked movie to watchlistBody
        clonedTag.removeChild(clonedTag.childNodes[3]);
        clonedTag.removeChild(clonedTag.childNodes[2]);

        var bigDiv = document.createElement("div");
        bigDiv.appendChild(clonedTag);
        console.log(clonedTag);

        watchListInner.appendChild(bigDiv);
        allClones.push(clonedTag);
      }
    });
  });
}

// Pop up card after clicking More info button
function popUpCardInfo(movieDetails) {
  console.log(movieDetails);
  if (popUpCardContainer.firstChild) {
    popUpCardContainer.innerHTML = "";
  }
  card = document.createElement("div");
  card.classList.add("cards");
  let title = document.createElement("h1");
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  let plot = document.createElement("p");
  plot.classList.add("phoneDisplay");
  let closeCard = document.createElement("a");
  closeCard.classList.add("delete");
  closeCard.classList.add("is-medium");
  closeCard.addEventListener("click", function() {
    card.style.display = "none";
  });

  title.innerText = movieDetails.original_title;
  title.style.fontSize = "30px";
  figure.classList.add("images");
  figure.style.backgroundImage = `url(${imageTemplate}${movieDetails.poster_path})`;

  plot.innerText = movieDetails.overview;
  card.appendChild(closeCard);
  card.appendChild(figure);
  card.appendChild(title);
  card.appendChild(plot);

  popUpCardContainer.appendChild(card);
}

// closes popup card when clicking outside of it
body.addEventListener("click", function(e) {
  if (card != undefined) {
    if (!card.contains(e.target)) {
      card.style.display = "none";
    }
  }
});

// goes to previous page of movies on click
arrowBack.addEventListener("click", async function() {
  if (page != 1) {
    page--;
    var movies = await getMovies(genre.value, years.value).catch(res => {
      console.log("error");
    });
    console.log(movies);
    contain.innerHTML = "";

    movieDomCreator(movies);
    pageIndicator.innerText = `page ${page}`;
  }
});

// goes to next page of movies on click
arrowForward.addEventListener("click", async function() {
  page++;
  var movies = await getMovies(genre.value, years.value).catch(res => {
    console.log("error");
  });
  console.log(movies);
  contain.innerHTML = "";

  movieDomCreator(movies);
  pageIndicator.innerText = `page ${page}`;
});

// displays watchlist
watchList.addEventListener("click", function() {
  watchListBody.classList.add("zIndex");
  watchListBody.style.height = "100vh";
});

// when clicking X to close watchlist
closeWatchList.addEventListener("click", function() {
  watchListBody.style.height = "0px";
});
