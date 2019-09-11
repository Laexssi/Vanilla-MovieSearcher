const apiKey = "31a2acbd095355e3b5ac823a2a6f17a4";
const searchForm = document.querySelector("#search-form");
const searchText = document.querySelector(".form-control");
const movies = document.querySelector("#movies");
const container = document.querySelector("#container-movies");

const urlPoster = "https://image.tmdb.org/t/p/w500";
const noPosterUrl = "https://filmitorrentom.org/films/noposter.jpg";
let page = 1;
let searchTextValue = "";
let searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru`;
const trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ru`;
const genreMoviesUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ru`;
const genreTVUrl = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=ru`;
let buttonUrl;

const generateMovieCard = (item, index) => {
  try {
    const movieCard = document.createElement("div");
    movieCard.classList.add("col-12", "col-md-6", "col-xl-3", "card");

    const movieCardBody = document.createElement("div");
    movieCardBody.classList.add("card-block");

    const spacer = document.createElement("div");
    spacer.classList.add("spacer");

    const movieName = document.createElement("h5");
    movieName.classList.add("card-title");
    const movieTitle = item.name || item.title;
    movieTitle.length > 33
      ? (movieName.innerHTML = `${movieTitle.slice(0, 30)}...`)
      : (movieName.innerHTML = movieTitle);

    const moviePoster = document.createElement("img");
    moviePoster.classList.add("card-img-top");
    moviePoster.src = item.poster_path
      ? (posterUrl = `${urlPoster + item.poster_path}`)
      : (posterUrl = noPosterUrl);
    moviePoster.alt = movieTitle;

    if (item.media_type !== "person") {
      movies.appendChild(movieCard);
      movieCard.appendChild(spacer);
      spacer.appendChild(moviePoster);
      spacer.appendChild(movieCardBody);
      movieCardBody.appendChild(movieName);
    }

    const mediaType = item.title ? "movie" : "tv";

    if (movieCard) {
      movieCard.setAttribute("index", index);
      movieCard.setAttribute("page", page);
      movieCard.setAttribute("data-id", item.id);
      movieCard.setAttribute("data-type", mediaType);
      movieCard.setAttribute("genres-ids", item.genre_ids);
    }
    const movieGenres = document.createElement("p");
    movieGenres.classList.add("card-text");

    const genreArr =
      mediaType === "movie"
        ? JSON.parse(localStorage.getItem("movies")).genres
        : JSON.parse(localStorage.getItem("TV")).genres;

    const rebuild = genreArr.reduce((acc, value) => {
      acc[value.id] = value.name;
      return acc;
    }, {});
    const genresId =
      item.genre_ids.length != 0
        ? item.genre_ids
            .map(value => rebuild[value])
            .map(value => value[0].toUpperCase() + value.slice(1))
            .join(" / ")
        : "Жанр неизвестен";
    movieGenres.innerHTML = `${genresId}`;

    movieCardBody.appendChild(movieGenres);

    const templateButton = document.querySelector("#load-button-template");

    const cloneTemplateButton = templateButton.content.cloneNode(true);

    if (index >= 19) {
      movies.appendChild(cloneTemplateButton);
    }

    addEventMovies();
  } catch (error) {
    console.log(error);
  }
};

const loadContent = url => {
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  fetch(url)
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
          "<h2 class='col-12 text-center text-info'>Ничего не найдено</h2>"
        );
        return;
      }

      output.results.forEach((item, index) => {
        generateMovieCard(item, index);
      });
      buttonUrl = url;
      if (document.querySelector(".btn")) {
        document
          .querySelector(".btn")
          .setAttribute("onclick", "loadNextPage(buttonUrl)");
      }

      if (buttonUrl === trendingUrl) {
        container.insertAdjacentHTML(
          "afterbegin",
          "<div class='trend-title'><h2 class='col-12 text-center '>Популярные на этой неделе</h2></div>"
        );
      }
    })
    .catch(reason => console.error(reason));
};

const loadSearchContent = url => {
  url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru`;
  searchTextValue = searchText.value;
  searchUrl = url + `&query=${searchTextValue}`;
  page = 1;
  if (searchTextValue.trim().length === 0) {
    movies.insertAdjacentHTML(
      "afterbegin",
      "<h2 class='col-12 text-center text-info'>Empty input</h2>"
    );
    return;
  }
  const trendTitle = document.querySelector(".trend-title");
  if (trendTitle) {
    trendTitle.remove();
  }
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  movies.innerHTML = "";
  loadContent(searchUrl);
};

const loadNextPage = url => {
  page += 1;
  console.log(page);

  const pageUrl = url + `&page=${page}`;
  const loadButton = document.querySelector("#load-button");
  loadButton.insertAdjacentHTML("beforebegin", '<div class="spinner"></div>');
  fetch(pageUrl)
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
      if (document.querySelector(".btn")) {
        if (url == searchUrl) {
          document
            .querySelector(".btn")
            .setAttribute("onclick", "loadNextPage(searchUrl)");
          console.log(`${searchUrl}`);
        }
        if (url == trendingUrl) {
          document
            .querySelector(".btn")
            .setAttribute("onclick", "loadNextPage(trendingUrl)");
          console.log(`${trendingUrl}`);
        }
      }
    });
};

const addEventMovies = () => {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(elem => {
    elem.addEventListener("click", showFullInfo);
  });
};

const isScroll = () => {
  document.documentElement.scrollTop > 500
    ? document.querySelector(".button-scroll").classList.add("show")
    : document.querySelector(".button-scroll").classList.remove("show");
};

const scrollToTop = scrollDuration => {
  var scrollStep = -window.scrollY / (scrollDuration / 15),
    scrollInterval = setInterval(function() {
      if (window.scrollY != 0) {
        window.scrollBy(0, scrollStep);
      } else clearInterval(scrollInterval);
    }, 15);
};

function showFullInfo() {
  const movieUrl = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=${apiKey}&language=ru`;
  console.log(this.dataset.id);
  fetch(movieUrl)
    .then(result => {
      if (result.status !== 200) {
        return Promise.reject(result)
      }
      return result.json()
    })
    .then(result => console.log(result))
}

const getGenres = (url, itemName) => {
  if (localStorage.getItem(itemName) === null) {
    fetch(url)
      .then(result => {
        if (result.status !== 200) {
          return Promise.reject(result);
        }
        return result.json();
      })
      .then(output => localStorage.setItem(itemName, JSON.stringify(output)))
      .catch(reason => console.log(`Ошибка: ${reason.status}`));
  }
};

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  loadSearchContent(searchUrl);
});

document.addEventListener("DOMContentLoaded", loadContent(trendingUrl));
document.addEventListener(
  "DOMContentLoaded",
  getGenres(genreMoviesUrl, "movies")
);
document.addEventListener("DOMContentLoaded", getGenres(genreTVUrl, "TV"));
console.log(JSON.parse(localStorage.getItem("movies")));
console.log(JSON.parse(localStorage.getItem("TV")));

const debounce = (f, ms) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, args), ms);
  };
};

const delayScroll = debounce(isScroll, 1000);

window.onscroll = function() {
  delayScroll();
};
