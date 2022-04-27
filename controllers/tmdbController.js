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

exports.getMovie = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/movie/${id}?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.getTV = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/tv/${id}?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.findByTitle = (req, res) => {
    const title = req.params.title;
    fetch(`${baseUrl}/search/movie?${apiKey}&language=es-ES&query=${title}&page=1&include_adult=true`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.overvieyTVById = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/tv/${id}?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.cast = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/movie/${id}/credits?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.castTV = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/tv/${id}/credits?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.crew = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/movie/${id}/credits?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.crewTV = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/tv/${id}?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.platformsTV = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/tv/${id}/watch/providers?${apiKey}`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.platformsMovie = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/movie/${id}/watch/providers?${apiKey}`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

exports.external_idsTV = (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/tv/${id}/external_ids?${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}



exports.getMovies = (req, res) => {
    const query = req.params.query;
    const page = req.params.page;
    fetch(`${baseUrl}/search/movie?${apiKey}&language=es-ES&query=${query}&page=${page}`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}


exports.getTVShows = (req, res) => {
    const query = req.params.query;
    const page = req.params.page;
    fetch(`${baseUrl}/search/tv?${apiKey}&language=es-ES&query=${query}&page=${page}`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}


exports.getPersons = (req, res) => {
    const query = req.params.query;
    const page = req.params.page;
    fetch(`${baseUrl}/search/person?${apiKey}&language=es-ES&query=${query}&page=${page}`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}