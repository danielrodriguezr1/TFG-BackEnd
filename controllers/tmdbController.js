const fetch = require('node-fetch');
const baseUrl = "https://api.themoviedb.org/3";
const apiKey = 'api_key=4da6190ae8146416740424c70e3a2b85';


exports.getNowPlayingMovies =  (req, res) => {
    fetch(`${baseUrl}/movie/now_playing?${apiKey}&language=es-ES&page=1&region=ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.getTopRatedMovie =  (req, res) => {
    fetch(`${baseUrl}/discover/movie?${apiKey}&language=es-ES&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=4000&with_watch_monetization_types=flatrate`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.getPopularMovies =  (req, res) => {
    fetch(`${baseUrl}/movie/popular?${apiKey}&language=es-ES&page=1&region=ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.getPopularTV =  (req, res) => {
    fetch(`${baseUrl}/tv/popular?${apiKey}&language=es-ES&page=1&region=ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}