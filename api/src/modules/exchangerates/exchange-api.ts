import fetch from 'node-fetch';
import redis from 'redis';
const redisClient = redis.createClient(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);
import {promisify} from 'util';
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

const BASE_URL = 'https://api.exchangeratesapi.io/latest?base=';

export const getCurrencyData = async (currency: string) => {
    const cachedData = await getAsync(currency);

    if (cachedData) {
        console.log('cached currency rates.');
        return JSON.parse(cachedData);
    }

    console.log('Getting fresh currency rates...');
    const re = await fetch(`${BASE_URL}${currency}`);
    const apiData = await re.json();

    await setAsync(`${currency}-v2`, 60 * 10, JSON.stringify(apiData));

    return apiData;
};