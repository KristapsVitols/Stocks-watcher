import fetch from 'node-fetch';
import redis from 'redis';
const redisClient = redis.createClient(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);
import {promisify} from 'util';
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

const BASE_URL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com';

export const getYahooQuote = async () => {
    // const cachedData = await getAsync(ticker);
    //
    // if (cachedData) {
    //     console.log('Cached iex cloud data for: ' , ticker);
    //     return JSON.parse(cachedData);
    // }

    console.log('Getting fresh stock quotes!');

    const re = await fetch(`${BASE_URL}/auto-complete?q=tesla&region=US`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "0c4c1bf625mshc7e4ecf6207e464p1574cdjsn92413f4f89bf",
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }
    });

    const data = await re.json();

    return data;
};