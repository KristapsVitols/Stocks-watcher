import {Brokerage} from './brokerage';
import {Transfer} from './brokerage-transfer';

export const getBrokerages = () => {
    return Brokerage.find().populate('transfers');
};

export const addBrokerage = async (name: string) => {
    const brokerage = new Brokerage();
    // @ts-ignore
    brokerage.name = name;

    await brokerage.save();

    return brokerage;
};

export const addTransfer = async (name: string, date: string, amount: string) => {
    const brokerage = await Brokerage.findOne({name});

    if (!brokerage) {
        return null;
    }

    // @ts-ignore
    brokerage.transfers.push({date, amount: Number(amount)});

    await brokerage.save();

    return brokerage;
};