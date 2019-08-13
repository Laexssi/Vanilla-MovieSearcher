const apiKey = '31a2acbd095355e3b5ac823a2a6f17a4';
const searchForm = document.querySelector('#search-form');
const searchText = document.querySelector('.form-control');
const movie = document.querySelector('#movies');

const apiSearch = (e) => {
    e.preventDefault();
    const searchTextValue = searchText.value;
    const server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
    requestApi('GET', server);

};

const requestApi = (method, url) => {

    const request = new XMLHttpRequest();

    request.open(method, url);
    request.send();
    request.responseType = "json";
    request.onprogress = () => movie.innerHTML = `readyState: ${request.readyState}`;
    request.onload = () => {
        movie.innerHTML = "";
        if (request.status !== 200) {
            movie.innerHTML = `Ошибка ${request.status}: ${request.statusText}`;
            console.log('error' + request.status)
        }
        
        const output = request.response;
        
        if (output.results.length == 0) {
            movie.innerHTML = "Ничего не найдено";
        }
        
        output.results.forEach ((item) => {
            let nameItem = item.name || item.title;
            const movieName = document.createElement("div");
            movieName.classList.add("col-12", "col-md-4", "col-xl-3");
            movie.appendChild(movieName);
            movieName.innerHTML = nameItem;
        })
        
        console.log(output);
    }
};

searchForm.addEventListener('submit', apiSearch);
    
