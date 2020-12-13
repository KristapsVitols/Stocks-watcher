import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        ticker: {
            type: String,
            required: true,
        },
        shares: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: false,
        },
        brokerage: {
            // @ts-ignore
            type: mongoose.Schema.ObjectId,
            ref: 'Brokerage',
            required: true,
            index: true,
        },
        purchasedAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const Holding = mongoose.model('Holding', holdingSchema);
