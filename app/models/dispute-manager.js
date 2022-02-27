const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require('validator')
const DisputeManagerSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: false,
        select: false
    },
    confirmPassword: {
        type: String,
        required: false,
        select: false
    },

    image: {
        type: String,
        required: false
    },
    contactNumber: {
        type: Number,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true,
});
DisputeManagerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("DisputeManager", DisputeManagerSchema);