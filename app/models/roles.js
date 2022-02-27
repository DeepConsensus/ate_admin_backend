const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const rolesSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    role_name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    versionKey: false,
    timestamps: true
})
rolesSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Roles', rolesSchema)