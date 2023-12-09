import fetch from 'node-fetch';
import redis from 'redis';
const redisClient = redis.createClient(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);
import {promisify} from 'util';
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

const BASE_URL = 'https://cloud.iexapis.com/v1';

export const getStockQuote = async (ticker: string) => {
    const cachedData = await getAsync(ticker);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    console.log('Getting fresh stock quotes!');

    const re = await fetch(`${BASE_URL}/stock/${ticker}/quote?token=${process.env.IEX_CLOUD_SECRET}`);
    const apiData = await re.json();

    await setAsync(ticker, 60 * 15, JSON.stringify(apiData));

    return apiData;
};