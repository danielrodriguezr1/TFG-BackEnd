const fetch = require('node-fetch');
const baseUrl = "https://imdb-api.com/es/API";
const apiKey = 'k_yp2sap51';

exports.getRatings =  (req, res) => {
    const id = req.params.id;
    fetch(`${baseUrl}/Ratings/${apiKey}/${id}`)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        res.send(json);
    });
}

