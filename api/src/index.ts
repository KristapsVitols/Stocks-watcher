import express from 'express';
import dotenv from 'dotenv';
import {initDatabase} from './db';
dotenv.config();

(async () => await initDatabase())();
// @ts-ignore
import {
    getBrokerages,
    addTransfer,
    addBrokerage,
    addHolding, getTotalWorth
} from './modules/brokerage/brokerage-service';
import {Transfer} from './modules/brokerage/brokerage-transfer';

new Transfer();

const app = express();
app.use(express.json());

app.get('/api/brokerages', async (req, res) => {
    const brokerages = await getBrokerages();

    res.json({success: true, brokerages});
});

app.get('/api/total-worth', async (req, res) => {
    const total = await getTotalWorth();

    res.json({success: true, total});
});

app.post('/api/brokerages', async (req, res) => {
    const brokerage = await addBrokerage(req.body.name);

    res.json({success: true, brokerage});
});

app.post('/api/brokerages/:brokerageId/transfers', async (req, res) => {
    const brokerage = await addTransfer(req.params.brokerageId, req.body.date, req.body.amount);

    res.json({success: true, brokerage});
});

app.post('/api/brokerages/:brokerageId/holdings', async (req, res) => {
    const brokerage = await addHolding(req.params.brokerageId, req.body.ticker, req.body.companyName, req.body.shares);

    res.json({success: true, brokerage});
});

app.listen(process.env.API_PORT, () => console.log('Up on 5000'));