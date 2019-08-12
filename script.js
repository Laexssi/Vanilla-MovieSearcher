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

    request.addEventListener('load', () => {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            console.log('error' + request.status)
        }
        
        const output = JSON.parse(request.responseText);
        let inner = '';
        output.results.forEach ((item) => {
            let nameItem = item.name || item.title;
            inner +=  `<div class="col-12 col-md-4 col-xl-3">${nameItem}</div>`
        })
        movie.innerHTML = inner;
        console.log(output);
    })
};

searchForm.addEventListener('submit', apiSearch);