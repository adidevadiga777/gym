const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imgUrl:{
        type: String,
        required: [true, 'Image URL is required']
    },
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    mobileNumber:{
        type: String,
        required: [true, 'Mobile number is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required']
    },
    planName:{
        type: String,
        required: [true, 'Plans are required']
    },
    dateOfJoin: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'unpaid'],
        default: 'active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    }
})

const postModel = mongoose.model('gymmem', postSchema);

module.exports = postModel;