const apiKey = "31a2acbd095355e3b5ac823a2a6f17a4";
const searchForm = document.querySelector("#search-form");
const searchText = document.querySelector(".form-control");
const movies = document.querySelector("#movies");
const container = document.querySelector("#container-movies");
let followMovieSet;

const urlPoster = "https://image.tmdb.org/t/p/w500";
const noPosterUrl = ` http://www.proficinema.ru/assets/images/cnt/poster_no.png`;
let page = 1;
let searchTextValue = "";
let searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru`;
const trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ru`;
const genreMoviesUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ru`;
const genreTVUrl = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=ru`;
const onlyMoviesUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=ru`;
const onlyTVUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&language=ru`;

let buttonUrl;

const showFollowList = arr => {
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  const trendTitle = document.querySelector(".trend-title");
  if (trendTitle)
    trendTitle.innerHTML = `<h3 class="col-12 text-center">Фильмы, за которыми следите</h3>`;
  movies.innerHTML = "";
  arr.forEach(async (item, index) => {
    const url = `https://api.themoviedb.org/3/movie/${item}?api_key=${apiKey}&language=ru`;
    await fetch(url)
      .then(result => {
        if (result.status !== 200) {
          return Promise.reject(result);
        }
        return result.json();
      })
      .then(item => {
        console.log(item);
        const movieCard = document.createElement("div");
        movieCard.classList.add("col-12", "col-md-6", "col-xl-3", "card");

        const movieCardBody = document.createElement("div");
        movieCardBody.classList.add("card-block");

        const spacer = document.createElement("div");
        spacer.classList.add("spacer");

        const unfollowButton = document.createElement("div");
        unfollowButton.classList.add(
          "btn",

          "btn-sm",
          "btn-follow",
          "active",
          "fa-bookmark",
          "fas"
        );
     
        unfollowButton.setAttribute(
          "onclick",
          "removeFromFollowWithRender(this)"
        );
        unfollowButton.setAttribute("data-id", `${item.id}`);

        const movieName = document.createElement("h5");
        movieName.classList.add("card-title");
        const movieTitle = item.name || item.title;
        movieTitle.length > 33
          ? (movieName.innerHTML = `${movieTitle.slice(0, 30)}...`)
          : (movieName.innerHTML = movieTitle);

        const moviePoster = document.createElement("img");
        moviePoster.classList.add("card-img-top");
        moviePoster.src = item.poster_path
          ? `${urlPoster + item.poster_path}`
          : noPosterUrl;
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

        const genresId =
          item.genres.length != 0
            ? item.genres
                .map(obj => obj.name[0].toUpperCase() + obj.name.slice(1))
                .join(" / ")
            : "Жанр неизвестен";
        movieGenres.innerHTML = `${genresId}`;

        movieCardBody.appendChild(movieGenres);
        spacer.appendChild(unfollowButton);
        addEventMovies();
      });
  });
};

const addToFollow = button => {
  const id = button.getAttribute("data-id");
  if (followMovieSet.includes(id)) return;
  followMovieSet.push(id);
  // console.log(followMovieSet);
  localStorage.setItem("followMovieSet", JSON.stringify(followMovieSet));
  
  button.setAttribute("onclick", "removeFromFollow(this)");
  button.setAttribute("data-id", id);

  button.classList.toggle("fas");
  button.classList.toggle("far");
  button.classList.toggle("active");
};

const removeFromFollow = button => {
  const id = button.getAttribute("data-id");

  const newFollowMovieSet = followMovieSet.filter(value => value !== id);
  followMovieSet = newFollowMovieSet;
  // console.log(newFollowMovieSet);
  localStorage.setItem("followMovieSet", JSON.stringify(newFollowMovieSet));
  button.innerText = "";
  button.setAttribute("onclick", "addToFollow(this)");
  button.classList.toggle("active");
  button.classList.toggle("fas");
  button.classList.toggle("far");
 
};

const removeFromFollowWithRender = button => {
  removeFromFollow(button);
  showFollowList(followMovieSet);
};

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
      ? `${urlPoster + item.poster_path}`
      : noPosterUrl;
    moviePoster.alt = movieTitle;

    if (item.media_type !== "person") {
      movies.appendChild(movieCard);
      movieCard.appendChild(spacer);
      spacer.appendChild(moviePoster);
      spacer.appendChild(movieCardBody);
      movieCardBody.appendChild(movieName);
    }

    const mediaType = item.title ? "movie" : "tv";
    if (followMovieSet.includes(item.id.toString(10))) {
      const unfollowButton = document.createElement("div");
      unfollowButton.classList.add("btn", "btn-sm", "btn-follow", "active", "fa-bookmark", "fas");
      
      unfollowButton.setAttribute("onclick", "removeFromFollow(this)");
      unfollowButton.setAttribute("data-id", item.id);
      if (mediaType === "movie") spacer.appendChild(unfollowButton);
    } else {
      const followButton = document.createElement("div");
      followButton.classList.add("btn", "btn-sm", "btn-follow", "fa-bookmark", "far");
     
      followButton.setAttribute("onclick", "addToFollow(this)");
      followButton.setAttribute("data-id", item.id);
      if (mediaType === "movie") spacer.appendChild(followButton);
    }

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

    if (item.genre_ids) {
      const genresId =
        item.genre_ids.length != 0
          ? item.genre_ids
              .map(value => rebuild[value])
              .map(value => {
                if (value === undefined) {
                  return "";
                } else {
                  return value[0].toUpperCase() + value.slice(1);
                }
              })
              .join(" / ")
          : "Жанр неизвестен";
      movieGenres.innerHTML = `${genresId}`;

      movieCardBody.appendChild(movieGenres);
    }
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
  movies.innerHTML = "";
  container.insertAdjacentHTML("beforeend", '<div class="spinner"></div>');
  fetch(url)
    .then(result => {
      // console.log(result);
      if (result.status !== 200) {
        return Promise.reject(result);
      }
      return result.json();
    })
    .then(output => {
      movies.innerHTML = "";
      const spinner = document.querySelector(".spinner");
      spinner.remove();
      // console.log(output);

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
      if (document.querySelector("#load-button")) {
        document
          .querySelector("#load-button")
          .setAttribute("onclick", "loadNextPage(buttonUrl)");
      }

      if (buttonUrl === trendingUrl) {
        container.insertAdjacentHTML(
          "afterbegin",
          "<div class='trend-title'><h3 class='col-12 text-center '>Популярные на этой неделе</h3></div>"
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
  movies.insertAdjacentHTML("beforeend", '<div class="spinner"></div>');

  const trendTitle = document.querySelector(".trend-title");
  trendTitle.innerHTML = `<h3 class="col-12 text-center">Результаты поиска</h3>`;
  movies.innerHTML = "";
  loadContent(searchUrl);
};

const loadNextPage = url => {
  page += 1;
  // console.log(page);

  const pageUrl = url + `&page=${page}`;
  const loadButton = document.querySelector("#load-button");
  loadButton.setAttribute("disabled", "disabled");
  loadButton.insertAdjacentHTML("beforebegin", '<div class="spinner"></div>');
  fetch(pageUrl)
    .then(result => {
      const spinner = document.querySelector(".spinner");
      loadButton.remove();
      spinner.remove();
      const output = result;
      // console.log(output);
      if (result.status !== 200) {
        return Promise.reject(result);
      }
      return result.json();
    })
    .then(output => {
      // console.log(output);

      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No more movies</h2>"
        );
      }
      output.results.forEach((item, index) => {
        generateMovieCard(item, index);
      });
      if (document.querySelector(".btn-block")) {
        if (url == searchUrl) {
          document
            .querySelector(".btn-block")
            .setAttribute("onclick", "loadNextPage(searchUrl)");
          // console.log(`${searchUrl}`);
        }
        if (url == trendingUrl) {
          document
            .querySelector(".btn-block")
            .setAttribute("onclick", "loadNextPage(trendingUrl)");
          // console.log(`${trendingUrl}`);
        }
      }
    });
};

const addEventMovies = () => {
  const allPosters = document.querySelectorAll(".card-img-top");

  allPosters.forEach(elem => {
    const id = elem.parentNode.parentNode.getAttribute("data-id");
    const type = elem.parentNode.parentNode.getAttribute("data-type");
    elem.setAttribute("data-id", id);
    elem.setAttribute("data-type", type);
    elem.addEventListener("click", showFullInfo);
  });
  const allTitles = document.querySelectorAll(".card-title");

  allTitles.forEach(elem => {
    const id = elem.parentNode.parentNode.parentNode.getAttribute("data-id");
    const type = elem.parentNode.parentNode.parentNode.getAttribute(
      "data-type"
    );
    elem.setAttribute("data-id", id);
    elem.setAttribute("data-type", type);
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
  movies.innerHTML = "";
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  let url = "";
  if (this.dataset.type === "movie") {
    url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=${apiKey}&language=ru`;
  } else if (this.dataset.type === "tv") {
    url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=${apiKey}&language=ru`;
  } else {
    movies.innerHTML = `<h2 class="col-12 text-center text-danger"> Не прописан тип карточки</h2>`;
  }
  console.log(this.dataset.id);
  fetch(url)
    .then(result => {
      if (result.status !== 200) {
        return Promise.reject(result);
      }
      return result.json();
    })
    .then(result => {
      console.log(result);
      const templateInfo = document.querySelector("#container-info-template");
      const clonetemplateInfo = templateInfo.content.cloneNode(true);

      const trendTitle = document.querySelector(".trend-title");
      const spinner = document.querySelector(".spinner");

      spinner.remove();
      movies.innerHTML = "";
      movies.appendChild(clonetemplateInfo);

      const movieInfoPoster = document.querySelector(".poster");
      const imdbRef = document.querySelector(".imdb-ref");
      const vote = document.querySelector(".vote");
      const release = document.querySelector(".release-date");
      const overview = document.querySelector(".overview");
      const followButton = document.querySelector(".btn-follow-info");

      const mediaType = result.title ? "movie" : "tv";
      trendTitle.innerHTML = `<h3 class="col-12 text-center">${result.name ||
        result.title}</h3>`;
      movieInfoPoster.src = result.poster_path
        ? `${urlPoster + result.poster_path}`
        : noPosterUrl;
      movieInfoPoster.alt = `${result.name || result.title}`;
      result.homepage
        ? (imdbRef.href = result.homepage)
        : (imdbRef.href = `https://imdb.com/title/${result.imdb_id}`);
      vote.innerHTML = `<b>Рейтинг</b>: ${result.vote_average}/10`;
      let releaseYear = result.release_date || result.first_air_date;
      release.innerHTML = `<b>Год выхода</b>: ${releaseYear.slice(0, 4)}`;
      overview.innerHTML = `<b>Описание</b>: <br>${result.overview}`;

      followButton.setAttribute("data-id", this.dataset.id);
      if (followMovieSet.includes(this.dataset.id.toString(10))) {
        followButton.setAttribute("onclick", `removeFromFollow(this)`);
        followButton.classList.add("active");
        followButton.classList.add("fa-bookmark");
        followButton.classList.add("fas");
      } else {
        followButton.setAttribute("onclick", `addToFollow(this)`);
        followButton.classList.add("fa-bookmark");
        followButton.classList.add("far");
  
        
      }

      getVideo(mediaType, this.dataset.id);
    });
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
      .then(output => localStorage.setItem(itemName, JSON.stringify(output)));
    // .catch(reason => console.log(`Ошибка: ${reason.status}`));
  }
};

const createFollowMovieSet = () => {
  followMovieSet =
    localStorage.getItem("followMovieSet") === null
      ? []
      : JSON.parse(localStorage.getItem("followMovieSet"));
  // console.log(followMovieSet);
};

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  loadSearchContent(searchUrl);
});

const getVideo = (type, id) => {
  const trailer = document.querySelector(".trailer");
  const title = document.querySelector(".trailer-title");
  const url = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=ru-RU`;

  fetch(url)
    .then(result => {
      // console.log(result);
      if (result.status !== 200) {
        return Promise.reject(result);
      }
      return result.json();
    })
    .then(output => {
      let videoFrame;
      if (output.results.length === 0) {
        videoFrame = `<b>Нет информации о трейлере</b>`;
      } else {
        title.innerHTML = `<b>Трейлер</b>:`;
        videoFrame = `<iframe class="embed-responsive-item" width="560" height="270" src="https://www.youtube.com/embed/${output.results[0].key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }

      trailer.innerHTML = videoFrame;
    })
    .catch(reason => console.error(reason));
};
document.addEventListener("DOMContentLoaded", createFollowMovieSet());
document.addEventListener("DOMContentLoaded", getGenres(genreTVUrl, "TV"));
document.addEventListener(
  "DOMContentLoaded",
  getGenres(genreMoviesUrl, "movies")
);
document.addEventListener("DOMContentLoaded", loadContent(trendingUrl));

// console.log(JSON.parse(localStorage.getItem("movies")));
// console.log(JSON.parse(localStorage.getItem("TV")));

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
