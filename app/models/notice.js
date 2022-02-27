const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const NoticeSchema = new mongoose.Schema({
    delivery_user: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
            default: null
        },
        deviceId: {
            type: String,
            required: true
        },
        deviceOS: {
            type: String,
            required: true,
            enum: ['IOS', 'ANDROID'],
            default: 'IOS'
        }
    },
    title: {
        type: String,
        required: true
    },
    notice: {
        type: String,
        required: true
    },
    extraNote: {
        type: String,
        default: null
    }
}, {
    versionKey: false,
    timestamps: true
})
NoticeSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('NoticeBoard', NoticeSchema)