const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
    name: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    isAdmin: { type: Boolean, required: true, default: false },
    refresh_token: { type: String, required: true }, 
    access_token: { type: String, required: true }  
    },
    {
        timestamps: true,
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;