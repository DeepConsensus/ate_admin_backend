const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require('validator')
const DeliveryPeopleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: 'EMAIL_IS_NOT_VALID'
        },
        lowercase: true,
        unique: true,
        required: false
    },
    address: {
        type: String,
        required: true,
        index: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longtitude: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    countrycode: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    deviceId: {
        type: String,
        required: false
    },
    deviceOS: {
        type: String,
        required: false,
        enum: ['IOS', 'ANDROID'],
        default: 'IOS'
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    versionKey: false,
    timestamps: true,
});
DeliveryPeopleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("DeliveryPeople", DeliveryPeopleSchema);