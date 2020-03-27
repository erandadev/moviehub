async function fetchLatestMovies() {
    let currentURL = window.location.href;
    let newURL = new URL(currentURL);
    let pageNo = newURL.searchParams.get('page');

    if(pageNo == null || pageNo == '') {
        pageNo = 1;
    }
    
    let req = await fetch('https://yts.mx/api/v2/list_movies.json?sort_by=year&page='+pageNo+'&minimum_rating=6');
    let res = await req.json();
    const moviesContainer = document.getElementById('movies');
    let movies = res.data.movies;


    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        moviesContainer.innerHTML += `
            <a href="details.html?id=${movie.id}">
                <div class="movie">
                    <img src="${movie.medium_cover_image}" alt="thubnail">
                    <h3>${movie.title_english}</h3>
                    <h4>${movie.year}</h4>
                </div>
            </a>
        `;

    });
}

async function fetchMovieDetails() {
    let currentUrl = window.location.href;
    let url = new URL(currentUrl);
    let id = url.searchParams.get('id');
    const movieContainer = document.getElementById('movie-deatils');

    let req = await fetch('https://yts.mx/api/v2/movie_details.json?movie_id=' + id);
    
    movieContainer.innerHTML = "";
   
    if(req.status = 200) {
        let res = await req.json();
        let movie = res.data.movie;

        console.log(movie)

        movieContainer.innerHTML += `
         <div class="movie-deatils-left">    
            <img src="${movie.large_cover_image}" alt="thubnail">
            <div class="genres">
                <p>${movie.genres[0]}</p>
                <p>${movie.genres[1]}</p>
            </div>
        </div>

        <div class="movie-deatils-right">
            <h1>${movie.title_long}</h1>
            <p>${movie.description_full}</p>


            <ul>
                <li><strong>Rating: </strong> ${movie.rating}</li>
                <li><strong>Runtime: </strong> ${movie.runtime} minutes</li>
                <li><strong>Language: </strong> ${movie.language}</li>
                <li><strong>Download Count: </strong> ${movie.download_count}</li>    
            </ul>
            
                <div id="download-btns"></div>
            </div>
            `;

            const downloadBtns = document.getElementById("download-btns");
            downloadBtns.innerHTML = '';

            movie.torrents.forEach(torrent => {
                if(torrent.type != 'web') {
                    downloadBtns.innerHTML += `<a class="btn-download" href="${torrent.url}" target="_blank">${torrent.quality} (${torrent.size})</a>`;
                } else {
                    downloadBtns.innerHTML += `<a class="btn-download" href="${torrent.url}" target="_blank">WEB ${torrent.quality} (${torrent.size})</a>`;
                }


                // if(downloadBtns.innerHTML == '') {
                //     downloadBtns.innerHTML = "<h3>Full HD qulity is not available yet.</h3>";
                // }
            });
    }
}


document.getElementById('search').addEventListener('keyup', async () => {
    let searchTxt = document.getElementById('search').value;
    
    let req = await fetch('https://yts.lt/api/v2/list_movies.json?query_term=' + searchTxt + '&limit=2');
    let res = await req.json();
    const searchResult= document.getElementById("search-results");
    searchResult.innerHTML = '';

    if(searchTxt = '') {
        const searchResult= document.getElementById("search-results");
        searchResult.innerHTML = '';
    }

    if(res.data.movie_count > 0) {
        let movies = res.data.movies;
        console.log(movies)

        movies.forEach(movie => {
            searchResult.innerHTML += `
                <a href="details.html?id=${movie.id}">
                    <li class="search-result" onclick="show">
                    <img src="${movie.medium_cover_image}" alt="">
                    <div><h5><Strong>${movie.title}</Strong></h5>${movie.year}</div>
                    </li>
                </a>
            `;
        });
        
    }

});


function removeSearchResult() {
    const searchResult= document.getElementById("search-results");
    searchResult.innerHTML = '';
}


function goToPreviousPage() {
    let currentURL = window.location.href;
    let newURL = new URL(currentURL);
    let pageNo = newURL.searchParams.get('page');

    if(pageNo != '' || pageNo != null) {
        pageNo = parseInt(pageNo);
        if(pageNo > 1) {
            pageNo -= 1;
            console.log(pageNo)
            window.location = "index.html?page=" + pageNo;
        }
    } 

}

function goToNextPage() {
    let currentURL = window.location.href;
    let newURL = new URL(currentURL);
    let pageNo = newURL.searchParams.get('page');

    if(pageNo != '' && pageNo != null) {
        pageNo = parseInt(pageNo);
        pageNo += 1;
        window.location = "index.html?page=" + pageNo;
    } else {
        console.log('elese')
        window.location = "index.html?page=2";
    }
}
