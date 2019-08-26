const apiKey = "31a2acbd095355e3b5ac823a2a6f17a4";
const searchForm = document.querySelector("#search-form");
const searchText = document.querySelector(".form-control");
const movies = document.querySelector("#movies");
const container = document.querySelector("#container-movies");

const urlPoster = "https://image.tmdb.org/t/p/w500";
const noPosterUrl = "https://filmitorrentom.org/films/noposter.jpg";
let page = 1;
let searchTextValue = "";
const trendignUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ru`;


const generateMovieCard = (item, index) => {
  const movieCard = document.createElement('div');
  movieCard.classList.add("col-12", "col-md-6", "col-xl-3", "card");

  const movieCardBody = document.createElement('div');
  movieCardBody.classList.add("card-block");

  const spacer = document.createElement('div');
  spacer.classList.add("spacer");

  const movieName = document.createElement('h5');
  movieName.classList.add("card-title")
  const movieTitle = item.name || item.title;
  movieTitle.length > 33?
  movieName.innerHTML = `${movieTitle.slice(0, 30)}...`:
  movieName.innerHTML = movieTitle;


  const moviePoster = document.createElement('img');
  moviePoster.classList.add("card-img-top");
  moviePoster.src = item.poster_path
    ? posterUrl = `${urlPoster + item.poster_path}`
    : posterUrl = noPosterUrl;
  moviePoster.alt = movieTitle;

  if (item.media_type !== "person") {
    movies.appendChild(movieCard);
    movieCard.appendChild(spacer);
    spacer.appendChild(moviePoster);
    spacer.appendChild(movieCardBody);
    movieCardBody.appendChild(movieName);
  }

  let mediaType = item.title? "movie" : "tv";

  movieCard.setAttribute('index', index);
  movieCard.setAttribute('page', page);
  movieCard.setAttribute('data-id', item.id);
  movieCard.setAttribute('data-type', mediaType);



  const templateButton = document.querySelector("#load-button-template")

  const cloneTemplateButton = templateButton.content.cloneNode(true);


  if (index >= 19) {
    movies.appendChild(cloneTemplateButton);
  }

  addEventMovies();



};

const loadContent = (server) => {
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  fetch(server)
    .then(result => {
      console.log(result);
      if (result.status !== 200) {
        return Promise.reject(result);


      }
      return result.json();
    })
    .then(output => {
      movies.innerHTML = "";
      console.log(output);

      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No results</h2>"
        );
      }

      output.results.forEach((item, index) => {

        generateMovieCard(item, index);

      });
    })
    .catch(reason => (movies.innerHTML = `Ошибка: ${reason.status}`));
}

const loadSearchContent = e => {
  e.preventDefault();
  searchTextValue = searchText.value;
  const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
  page = 1;
  if (searchTextValue.trim().length === 0) {
    movies.insertAdjacentHTML(
      "afterbegin",
      "<h2 class='col-12 text-center text-info'>Empty input</h2>"
    );
    return;
  }
  const trendTitle = document.querySelector(".trend-title");
  trendTitle.remove();
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  movies.innerHTML = "";
  
  
  loadContent(searchUrl);
};

const loadNextPage = () => {
  page += 1;
  console.log(page);

  const nextPage = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}&page=${page}`;
  const loadButton = document.querySelector('#load-button');
  loadButton.insertAdjacentHTML("beforebegin", '<div class="spinner"></div>');
  fetch(nextPage)
    .then(result => {
      const spinner = document.querySelector(".spinner");
      loadButton.remove();
      spinner.remove();
      const output = result;
      console.log(output);
      if (result.status !== 200) {
        return Promise.reject(result);
      }
      return result.json();
    })
    .then(output => {
      
      console.log(output);

      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No more movies</h2>"
        );
      }
      output.results.forEach((item, index) => {
        generateMovieCard(item, index);
      });
    })
};

const loadTrendContent = (server) => {
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  fetch(server)
    .then(result => {
      console.log(result);
      if (result.status !== 200) {
        return Promise.reject(result);


      }
      return result.json();
    })
    .then(output => {
      movies.innerHTML = "";
      console.log(output);

      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No results</h2>"
        );
      }

      container.insertAdjacentHTML(
        "afterbegin",
        "<div class='trend-title'><h2 class='col-12 text-center text-info'>Популярные на этой неделе</h2></div>"
      );

      output.results.forEach((item, index) => {

        generateMovieCard(item, index);

      });

      document.querySelector(".btn").setAttribute("onclick", "loadNextTrandingPage()");
    })
    .catch(reason => (movies.innerHTML = `Ошибка: ${reason.status}`));
}
const loadNextTrandingPage = () => {

  page += 1;
  console.log(page);

  const nextPage = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ru&page=${page}`;
  const loadButton = document.querySelector('#load-button');
  loadButton.insertAdjacentHTML("beforebegin", '<div class="spinner"></div>');
  fetch(nextPage)
    .then(result => {
      const spinner = document.querySelector(".spinner");
      loadButton.remove();
      spinner.remove();
      console.log(result);
      if (result.status !== 200) {
        return Promise.reject(result);
      }
      return result.json();
    })
    .then(output => {
      
      console.log(output);

      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No more movies</h2>"
        );
      }
      output.results.forEach((item, index) => {
        generateMovieCard(item, index);
      });
      document.querySelector(".btn").setAttribute("onclick", "loadNextTrandingPage()");
    })
};


const addEventMovies = () => {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((elem) => { 
    
    elem.addEventListener("click", showFullInfo) })
};

const isScroll = () => {


  (document.documentElement.scrollTop > 500)
    ? document.querySelector(".button-scroll").classList.add("show")
    : document.querySelector(".button-scroll").classList.remove("show")
};

const scrollToTop = (scrollDuration) => {

  var scrollStep = -window.scrollY / (scrollDuration / 15),
    scrollInterval = setInterval(function () {
      if (window.scrollY != 0) {
        window.scrollBy(0, scrollStep);
      }
      else clearInterval(scrollInterval);
    }, 15);
}

function showFullInfo() {
  console.log(this);
}

searchForm.addEventListener("submit", loadSearchContent);
document.addEventListener("DOMContentLoaded", loadTrendContent(trendignUrl));





window.onscroll = function () { isScroll() };


