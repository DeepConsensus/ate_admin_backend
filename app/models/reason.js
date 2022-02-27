const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require('validator')

const ReasonSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true,
        index: true
    }
}, {
    versionKey: false,
    timestamps: true,
});
ReasonSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Reason", ReasonSchema);