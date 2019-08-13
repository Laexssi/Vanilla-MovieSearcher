const apiKey = '31a2acbd095355e3b5ac823a2a6f17a4';
const searchForm = document.querySelector('#search-form');
const searchText = document.querySelector('.form-control');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
const movieBlock = document.querySelector('#container-movies')
const apiSearch = (e) => {
    e.preventDefault();
    const searchTextValue = searchText.value;
    const server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
    movie.innerHTML = `<div class="d-flex justify-content-center">
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>`;

    fetch(server)
        .then(result => {
            if (result.status !== 200) {
                return Promise.reject(result)
            }
            return result.json()
        })
        .then(output => {
            movie.innerHTML = "";
            
            console.log(output);

            if (output.results.length == 0) {
                movie.innerHTML = "Ничего не найдено";
            }

            output.results.forEach((item) => {
                let nameItem = item.name || item.title;
                const movieName = document.createElement("div");
                const moviePoster = document.createElement("img");
                item.poster_path ?
                moviePoster.src = `${urlPoster + item.poster_path}`:
                moviePoster.src = "https://filmitorrentom.org/films/noposter.jpg"
                moviePoster.alt = `${nameItem}`;
                moviePoster.classList.add("img-fluid");
                movieName.classList.add("col-12", "col-md-4", "col-xl-3", "item");
                movie.appendChild(movieName);
                movieName.innerHTML = `<h5>${nameItem}</h5>`;
                movieName.appendChild(moviePoster);
            })
        })
        .catch(reason => movie.innerHTML = `Ошибка: ${reason.status}`)
};




searchForm.addEventListener('submit', apiSearch);