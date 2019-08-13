const apiKey = '31a2acbd095355e3b5ac823a2a6f17a4';
const searchForm = document.querySelector('#search-form');
const searchText = document.querySelector('.form-control');
const movie = document.querySelector('#movies');

const apiSearch = (e) => {
    e.preventDefault();
    const searchTextValue = searchText.value;
    const server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
    movie.innerHTML = "Loading";
    requestApi('GET', server)
        .then(result => {
            movie.innerHTML = "";
            const output = result;
            console.log(output);

            if (output.results.length == 0) {
                movie.innerHTML = "Ничего не найдено";
            }
            
            output.results.forEach((item) => {
                let nameItem = item.name || item.title;
                const movieName = document.createElement("div");
                movieName.classList.add("col-12", "col-md-4", "col-xl-3");
                movie.appendChild(movieName);
                movieName.innerHTML = nameItem;
            })
        })
        .catch(reason => movie.innerHTML = `Ошибка: ${reason.status}`)
        ;

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
            reject({ status: request.status })
        };

        request.responseType = "json";
        request.send();

    })

};

searchForm.addEventListener('submit', apiSearch);

