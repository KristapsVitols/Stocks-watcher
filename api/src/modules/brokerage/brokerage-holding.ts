import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
    {
        ticker: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        shares: {
            type: Number,
            required: true,
        },
        brokerage: {
            // @ts-ignore
            type: mongoose.Schema.ObjectId,
            ref: 'Brokerage',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const Holding = mongoose.model('Holding', holdingSchema);
