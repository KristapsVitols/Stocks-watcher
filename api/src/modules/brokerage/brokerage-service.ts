import {Brokerage} from './brokerage';
import {Transfer} from './brokerage-transfer';
import {Holding} from './brokerage-holding';
import {getStockQuote} from '../iexcloud/iex-api';
import {convert} from '../exchangerates/exchange-rate-service';

export const getBrokerages = () => {
    return Brokerage.find().populate('transfers').populate('holdings');
};

export const addBrokerage = async (name: string) => {
    const brokerage = new Brokerage();
    // @ts-ignore
    brokerage.name = name;

    await brokerage.save();

    return brokerage;
};

export const addTransfer = async (brokerageId: string, date: string, amount: string) => {
    const brokerage = await Brokerage.findById(brokerageId);

    if (!brokerage) {
        return null;
    }

    const transfer = new Transfer();
    // @ts-ignore
    transfer.brokerage = brokerageId;
    // @ts-ignore
    transfer.date = date;
    // @ts-ignore
    transfer.amount = Number(amount);

    await transfer.save();

    return transfer;
};

export const addHolding = async (brokerageId: string, ticker: string, companyName: string, shares: string) => {
    const brokerage = await Brokerage.findById(brokerageId);

    if (!brokerage) {
        return null;
    }

    const holding = new Holding();
    // @ts-ignore
    holding.brokerage = brokerageId;
    // @ts-ignore
    holding.ticker = ticker;
    // @ts-ignore
    holding.companyName = companyName;
    // @ts-ignore
    holding.shares = Number(shares);

    await holding.save();

    return holding;
};

export const getTotalWorth = async () => {
    const holdings = await Holding.find();

    // {PLTR: 10, TSLA: 25} ... ...
    const groupedTickers = {};
    // 1. group by tickers?
    holdings.forEach(holding => {
        // @ts-ignore
        if (!groupedTickers[holding.ticker]) {
            // @ts-ignore
            groupedTickers[holding.ticker] = holding.shares;
        } else {
            // @ts-ignore
            groupedTickers[holding.ticker] += holding.shares;
        }
    });

    let total = 0;

    // 2. get each ticker quote in cycle and calculate exchange rate
    for (const ticker in groupedTickers) {
        const stockData = await getStockQuote(ticker);

        // 1. calculate total in USD
        // @ts-ignore
        const totalUsd = stockData.latestPrice * groupedTickers[ticker];

        // 2. exchange to EUR
        const totalEur = await convert(totalUsd, 'EUR');
        total += totalEur;
    }

    // etfs....
    // 312eur - IB INRG
    // 344eur - IB VUSA
    // 343eur - T212 VUSA
    // 591eur - T212 INRG
    total += (312 + 344 + 343 + 591);

    return total.toFixed(2);
};