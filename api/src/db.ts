import mongoose from 'mongoose';

export const initDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL!, {useNewUrlParser: true, useCreateIndex: true});
        console.log('DB connected...');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
