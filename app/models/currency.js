const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const currencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    versionKey: false,
    timestamps: true
})
currencySchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Currency', currencySchema)