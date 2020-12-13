import mongoose from 'mongoose';

const brokerageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

brokerageSchema.virtual('holdings', {
    ref: 'Holding',
    localField: '_id',
    foreignField: 'brokerage',
});

brokerageSchema.virtual('transfers', {
    ref: 'Transfer',
    localField: '_id',
    foreignField: 'brokerage',
})

export const Brokerage = mongoose.model('Brokerage', brokerageSchema);
