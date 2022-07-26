console.log("Starting");  
let result;
const searchList = document.getElementById('search-list');
const movieSearchBox = document.getElementsByClassName('search-input');
const resultGrid = document.getElementById('result-grid');




const displayResults = (data) => {
    const resultsArea = document.querySelector('.results-area');
    resultsArea.innerHTML = "";
    if (data.Response === "False") {
        return resultsArea.innerHTML = `
        <div>
            <h2>Não foi possivel localizar nenhum resultado</h2>
        </div>   
        `
    }
    return data.Search.map((item) => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('results-item');
        resultItem.innerHTML = `
            <img src="${item.Poster}">
            <h3>${item.Title}</h3>
            <p>${item.Year}</p>`;
        resultsArea.appendChild(resultItem);

        })
    
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}


const search = async (value) => {
    const URL = `https://omdbapi.com/?s=${value}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
    
}

window.onload = function() {
    console.log("Loaded");
    const SEARCH_INPUT = document.querySelector('.search-input');
    const SEARCH_SELECT = document.querySelector('#search-select');
    SEARCH_INPUT.value = "";
    SEARCH_INPUT.addEventListener('input', function(e) {
        console.log(SEARCH_INPUT.value,'value');
        let searchValue = SEARCH_INPUT.value;

        if (searchValue.length > 2) {
            console.log('Searching...');
            searchList.classList.remove('hide-search-list');
            search(searchValue);
        }

    })
};

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <p class = "genre"><b>Genero:</b> ${details.Genre}</p>
        <p class = "plot"><b>Enredo:</b> ${details.Plot}</p>
        <p class = "actors"><b>Atores: </b>${details.Actors}</p>
        <p class = "writer"><b>Direção:</b> ${details.Writer}</p>
        
        <ul class = "movie-misc-info">
            <li class = "released">Lançamento: ${details.Released}</li>
        <li class = "rated">Tempo de filme: ${details.Runtime}</li>
    </ul>
    </div>
    `;
}