import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Fixed event name (should be 'connected' not 'Connected')
        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connected');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        await mongoose.connect(`${process.env.MONGODB_URL}/greencart`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;