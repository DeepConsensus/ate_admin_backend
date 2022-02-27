const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const Restaurantstype = new mongoose.Schema({
    name: {
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
Restaurantstype.plugin(mongoosePaginate)
module.exports = mongoose.model('Restaurantstype', Restaurantstype)