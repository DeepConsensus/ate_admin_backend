const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PromocodesSchema = new mongoose.Schema({
    promocode: {
        type: String,
        required: true,
        index: true,
    },
    discount: {
        type: Number,
        required: true,
        index: true,
        default: 0,
    },
    usagelimit_percoupon: {
        type: Number,
        required: true,
        index: true,
        default: 0,
    },
    usagelimit_peruser: {
        type: Number,
        required: true,
        index: true,
        default: 0,
    },
    type: {
        type: String,
        required: true,
        enum: ["AMOUNT", "PERCENT"],
        default: "AMOUNT",
    },
    promocodetype: {
        type: String,
        required: true,
        enum: ["ADDED", "EXPIRED"],
        default: "ADDED",
    },

    avaiable_from: {
        type: Date,
    },
    expired_date: {
        type: Date,
    },
}, {
    versionKey: false,
    timestamps: true,
});
PromocodesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Promocodes", PromocodesSchema);