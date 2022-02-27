const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const NoticePushNotificationSchema = new mongoose.Schema({
    sent_to_type: {
        type: Number,
        required: true,
        enum: [1, 2, 3],
        default: 1,
        index: true
    },
    message: {
        type: String,
        required: true,
        index: true
    },
    push_type: {
        type: String,
        required: true,
        enum: ['NOW', 'SCHEDULE'],
        default: 'NOW',
        index: true
    },
    schedule: {
        senddate: {
            type: Date
        },
        sendtime: {
            type: String
        }
    },
    sent_status: {
        type: Number,
        default: 0
    },
    senton: {
        type: Date
    }
}, {
    versionKey: false,
    timestamps: true
})
NoticePushNotificationSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('NoticePushNotification', NoticePushNotificationSchema)