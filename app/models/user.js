const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const InterestSchema = new Schema({
    name: String,
    id: ObjectId
});

const ImageSchema = new Schema({
    src: String,
    key: String,
    status: Number
});
const UserSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        default: new Date().getTime() + Math.floor(10000000 + Math.random() * 9999999)
    },

    contact_number: {
        type: String,
        required: true
    },

    photos: [ImageSchema],
    summary: {
        type: String,
        required: false
    },
    state: {
        online: {
            type: Boolean,
            default: false
        },
        available: {
            type: Boolean,
            default: false
        }
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    lastlogin: {
        type: Date,
        set(v) {
            return new Date(
                v.getFullYear(),
                v.getMonth(),
                v.getDate(),
                v.getHours(),
                v.getMinutes(),
                v.getSeconds()
            )
        }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },

    avatar: {
        type: String,
        default: 'uploads/def-avatar.jpg'
    },



    verification: {
        type: String
    },
    verified: {
        type: Boolean,
        default: true
    },

    status: {
        type: Number,
        default: 1
    },
    loginAttempts: {
        type: Number,
        default: 0,
        select: false
    },
    blockExpires: {
        type: Date,
        default: Date.now,
        select: false
    },

}, {
    versionKey: false,
    timestamps: true
})

const hash = (user, salt, next) => {
    bcrypt.hash(user.password, salt, (error, newHash) => {
        if (error) {
            return next(error)
        }
        user.password = newHash
        return next()
    })
}

const genSalt = (user, SALT_FACTOR, next) => {
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) {
            return next(err)
        }
        return hash(user, salt, next)
    })
}

UserSchema.pre('save', function(next) {
    const that = this
    const SALT_FACTOR = 5
    if (!that.isModified('password')) {
        return next()
    }
    return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function(passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    )
}
UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)