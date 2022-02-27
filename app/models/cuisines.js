const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require('validator')
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    src: String,
    key: String
});
const CuisinesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    image: [ImageSchema]
}, {
    versionKey: false,
    timestamps: true,
});
CuisinesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Cuisines", CuisinesSchema);