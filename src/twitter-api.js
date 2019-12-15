const redis = require('redis');
const Twit = require('twit');
const config = require('../config.json');

// Create a redis client for caching
const client = redis.createClient();

// Log the error with this radis client
client.on('error', (err) => {
    console.log('Redis Error : '+err);
});

// Configure Twitter client with oauth 1.0 keys
var T = new Twit(config);

module.exports = (req,res) => {
    
    // If query source is not given then return invalid request
    if(!req.query.source){
        return res.json({
            status: "Invalid Request",
            message: "Please sepcify the source to search"
        });
    }

    // extract the query from url and trim trailing spaces
    const query = (req.query.source).trim();

    // Try fetching the result from redis first in case we have it cached
    return client.get(`Twitter:${query}`, (err,result) => {
        if(result){
            // If query found in cache then return no need to access the api
            result = JSON.parse(result);
            return res.json(result);
        } else {
            // If not fetch the twitter api, cache it and then return data
            T.get('search/tweets', { q: query, count: 20 }, function(err, data, response) {
                // this cache will expire after 3600 seconds
                client.setex(`Twitter:${query}`,3600,JSON.stringify({source: 'Twitter API', ...data}));
                res.json(data);
            });
        }
    });
}