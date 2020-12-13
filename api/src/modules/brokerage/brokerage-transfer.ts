import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        amount: {
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

export const Transfer = mongoose.model('Transfer', transferSchema);