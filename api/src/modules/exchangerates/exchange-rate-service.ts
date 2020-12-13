import {getCurrencyData} from './exchange-api';

export const convert = async (amount: number, convertTo: string) => {
    const currencyData = await getCurrencyData('USD');

    // @ts-ignore
    return Number((Number(amount) * currencyData.rates[convertTo]).toFixed(2));
};