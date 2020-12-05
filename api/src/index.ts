import express from 'express';
import dotenv from 'dotenv';
import {initDatabase} from './db';
dotenv.config();

(async () => await initDatabase())();
// @ts-ignore
import {getBrokerages, addTransfer, addBrokerage} from './modules/brokerage/brokerage-service';

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

app.listen(process.env.API_PORT, () => console.log('Up on 5000'));