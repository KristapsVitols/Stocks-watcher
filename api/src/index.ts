import express from 'express';
import dotenv from 'dotenv';
import {initDatabase} from './db';
dotenv.config();

(async () => await initDatabase())();
// @ts-ignore
import {getBrokerages, addTransfer, addBrokerage, migrateTransfers} from './modules/brokerage/brokerage-service';
import {getStockQuote} from './modules/iexcloud/iex-api';
import {convert} from './modules/exchangerates/exchange-rate-service';
import {Transfer} from './modules/brokerage/brokerage-transfer';

const app = express();
app.use(express.json());

app.get('/api/brokerages', async (req, res) => {
    const brokerages = await getBrokerages();

    res.json({success: true, brokerages});
});

app.post('/api/brokerages', async (req, res) => {
    const brokerage = await addBrokerage(req.body.name);

    res.json({success: true, brokerage});
});

app.put('/api/brokerages', async (req, res) => {
    const brokerage = await addTransfer(req.body.name, req.body.date, req.body.amount);

    res.json({success: true, brokerage});
});

app.post('/api/holdings', async (req, res) => {

});

app.get('/api/get-price', async (req, res) => {
    const data = await getStockQuote('pltr');

    res.json({success: true, data});
});

app.get('/api/convert', async (req, res) => {
    const convertedAmount = await convert('25.05', 'EUR');
    res.json({success: true, data: convertedAmount});
});

app.listen(process.env.API_PORT, () => console.log('Up on 5000'));