const apiKey = "31a2acbd095355e3b5ac823a2a6f17a4";
const searchForm = document.querySelector("#search-form");
const searchText = document.querySelector(".form-control");
const movies = document.querySelector("#movies");
const urlPoster = "https://image.tmdb.org/t/p/w500";
// const movieBlock = document.querySelector('#container-movies')

const apiSearch = e => {
  e.preventDefault();
  const searchTextValue = searchText.value;
  if (searchTextValue.trim().length === 0) {
    movies.insertAdjacentHTML(
      "afterbegin",
      "<h2 class='col-12 text-center text-info'>Пустой запрос</h2>"
    );
    return;
  }
  const server = `https://api.themoviedb.org/3/search/multi/?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  // movies.innerHTML = '<div class="spinner"></div>';

  fetch(server, {
    method: "GET",
  mode: 'no-cors',
    headers: {
      "Content-Type": "application/json",
     
    },
    xhrFields: {
      withCredentials: false
    }
  })
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
        movies.innerHTML = `<h2 class='col-12 text-info text-center'>
                    Ничего не найдено
                    </h2>`;
      }

      output.results.forEach((item, index) => {
        try {
          const movieTemplate = document.querySelector("#movies-template");
          const cloneMovieCard = movieTemplate.content.cloneNode(true);

          movies.appendChild(cloneMovieCard);

          const movieCard = document.querySelectorAll("#movie-card"),
            movieName = document.querySelectorAll("#movie-title"),
            moviePoster = document.querySelectorAll("#movie-poster");

          console.log(movieCard);

          let nameItem = item.name || item.title;
          let posterUrl;

          item.poster_path
            ? (posterUrl = `${urlPoster + item.poster_path}`)
            : (posterUrl = "https://filmitorrentom.org/films/noposter.jpg");

          movieName[index].innerHTML = nameItem;
          moviePoster[index].src = posterUrl;
          moviePoster[index].alt = nameItem;
          moviePoster[index].classList.add("img-fluid");
          movieCard[index].classList.add(
            "col-12",
            "col-md-4",
            "col-xl-3",
            "item"
          );

          if (index >= 19) {
            movies.appendChild
          }
        } catch (e) {
          console.log(e);
        }
      });
    })
    .catch(reason => (movies.innerHTML = `Ошибка: ${reason.status}`));
};

searchForm.addEventListener("submit", apiSearch);

function showInfo() {}
