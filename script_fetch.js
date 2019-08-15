const apiKey = '31a2acbd095355e3b5ac823a2a6f17a4';
const searchForm = document.querySelector('#search-form');
const searchText = document.querySelector('.form-control');
const movies = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
// const movieBlock = document.querySelector('#container-movies')

const apiSearch = (e) => {
    e.preventDefault();
    const searchTextValue = searchText.value;
    if (searchTextValue.trim().length === 0){
        movies.insertAdjacentHTML('afterbegin', "<h2 class='col-12 text-center text-info'>Пустой запрос</h2>");
        return;
    }
    const server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
    movies.insertAdjacentHTML('afterbegin', '<div class="spinner"></div>');
    // movies.innerHTML = '<div class="spinner"></div>';

    fetch(server)
        .then(result => {
            if (result.status !== 200) {
                return Promise.reject(result)
            }
            return result.json()
        })
        .then(output => {
            movies.innerHTML = "";
            
            console.log(output);

            if (output.results.length == 0) {
                movies.innerHTML = `<h2 class='col-12 text-info text-center'>
                    Ничего не найдено
                    </h2>`;
            }

            output.results.forEach((item) => {
                let nameItem = item.name || item.title;
                const movieCard = document.createElement("div");
                const movieName = document.createElement("h5");
                const moviePoster = document.createElement("img");

                item.poster_path ?
                moviePoster.src = `${urlPoster + item.poster_path}`:
                moviePoster.src = "https://filmitorrentom.org/films/noposter.jpg";

                moviePoster.alt = `${nameItem}`;
                moviePoster.classList.add("img-fluid");

                movieCard.classList.add("col-12", "col-md-4", "col-xl-3", "item");
                movieName.innerHTML = nameItem;
                movies.appendChild(movieCard);

                movieCard.appendChild(movieName)
                movieCard.appendChild(moviePoster);
            })
        })
        .catch(reason => movies.innerHTML = `Ошибка: ${reason.status}`)
};




searchForm.addEventListener('submit', apiSearch);

function showInfo() {

}