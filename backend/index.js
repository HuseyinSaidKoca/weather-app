const express = require('express');
var request = require('request');
const redis = require('redis');
var bodyParser = require('body-parser');
const cors = require("cors");

console.log(process.env.REDIS_HOST);
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
  legacyMode: true
});

(async () => {
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect()
    console.log("redis client ready")
})();

const app = express();

const corsOptions = {
  origin : '*'
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

var jsonParser = bodyParser.json()
let get_req_count=0;
app.post('/api/data', jsonParser,async (req, res) => {
  console.log("POST REQUEST RECEIVED")
  const queried_city=req.body.city
  const cachedData = await getAsync(queried_city);
  if (cachedData) {
   console.log("Data cached.")
   console.log("API REQUEST COUNT:" + get_req_count)
   return res.json(JSON.parse(cachedData));
  }

  var propertiesObject = { key:'your_api_key', q:queried_city, days:1 };
  const newData=null;
  request({url:"http://api.weatherapi.com/v1/forecast.json", qs:propertiesObject}, function(err, response, body) {
    if(err) { console.log(err); return; }
    get_req_count=get_req_count+1
    console.log("Get response: " + response.statusCode);
    console.log("API REQUEST COUNT:" + get_req_count)
    const newData=[]
    newData.push(JSON.parse(body).current)
    newData.push(JSON.parse(body).forecast.forecastday[0].day)
    client.set(queried_city, JSON.stringify(newData), 'EX', 120);
    res.json(newData);
  });
});

app.get('/api/data', async (req, res) => {
  res.send("Server running!")
});

const getAsync = (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});