import mongoose from 'mongoose';

const brokerageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        transfers: {
            type: Array,
            required: false,
            default: [],
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const Brokerage = mongoose.model('Brokerage', brokerageSchema);
