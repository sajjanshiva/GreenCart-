import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    
    // 'cartItems' field: stores user's cart data, default is an empty object
    cartItems: {type: Object, default: {} },

     // By default, Mongoose removes empty objects; setting this to false keeps them
},{minimize: false});


// Check if the 'user' model already exists (useful during hot-reloading in dev)
// If it exists, reuse it; if not, create a new model called 'user' with the defined schema
const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;