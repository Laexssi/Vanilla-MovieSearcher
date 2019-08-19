const apiKey = "31a2acbd095355e3b5ac823a2a6f17a4";
const searchForm = document.querySelector("#search-form");
const searchText = document.querySelector(".form-control");
const movies = document.querySelector("#movies");
const urlPoster = "https://image.tmdb.org/t/p/w500";
const noPosterUrl = "https://filmitorrentom.org/films/noposter.jpg";
let page = 1;
let searchTextValue = "";


const apiSearch = e => {
  e.preventDefault();
  searchTextValue = searchText.value;
  page = 1;
  startIndex = 0;
  if (searchTextValue.trim().length === 0) {
    movies.insertAdjacentHTML(
      "afterbegin",
      "<h2 class='col-12 text-center text-info'>Empty input</h2>"
    );
    return;
  }
  const server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
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
};

const requestApi = (method, url) => {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();

    request.open(method, url);
    request.onload = () => {
      if (request.status !== 200) {
        reject({ status: request.status });
        return;
      }

      resolve(request.response);
    };
    request.onerror = () => {
      reject({ status: request.status });
    };

    request.responseType = "json";
    request.send();
  });
};

const generateMovieCard = (item, index) => {
  const movieCard = document.createElement('div');
  movieCard.classList.add("col-12", "col-md-6", "col-xl-3", "item");



  const movieName = document.createElement('h5');
  const movieTitle = item.name || item.title;
  movieName.innerHTML = movieTitle;


  const moviePoster = document.createElement('img');
  moviePoster.classList.add("img-fluid");
  moviePoster.src = item.poster_path
    ? posterUrl = `${urlPoster + item.poster_path}`
    : posterUrl = noPosterUrl;
  moviePoster.alt = movieTitle;

  movies.appendChild(movieCard);
  movieCard.appendChild(moviePoster);
  movieCard.appendChild(movieName);


  movieCard.setAttribute('index', index);
  movieCard.setAttribute('page', page);



  const templateButton = document.querySelector("#load-button-template")

  const cloneTemplateButton = templateButton.content.cloneNode(true);


  if (index >= 19) {
    movies.appendChild(cloneTemplateButton);
  }
};

const loadNextPage = () => {
  page += 1;
  console.log(page);
 
  const server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}&page=${page}`;
  const loadButton = document.querySelector('#load-button');

  loadButton.insertAdjacentHTML("beforebegin", '<div class="spinner"></div>');

  requestApi("GET", server)
    .then(result => {
      const spinner = document.querySelector(".spinner");
      loadButton.remove();
      spinner.remove();
      const output = result;
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



searchForm.addEventListener("submit", apiSearch);


const isScroll = () => {

  
  ( document.documentElement.scrollTop > 500) 
  ? document.querySelector(".button-scroll").classList.add("show")
  : document.querySelector(".button-scroll").classList.remove("show")
}

const scrollToTop = (scrollDuration) => {

 var scrollStep = -window.scrollY / (scrollDuration / 15),
        scrollInterval = setInterval(function(){
        if ( window.scrollY != 0 ) {
            window.scrollBy( 0, scrollStep );
        }
        else clearInterval(scrollInterval); 
    },15);
}

window.onscroll = function() {isScroll()};