const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const CuisineSchema = new Schema({
    name: String,
    id: ObjectId
});
const CuisineUserSchema = new mongoose.Schema({
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
    cuisine: [CuisineSchema],
    countrycode: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 1
    }
}, {
    versionKey: false,
    timestamps: true,
});

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

CuisineUserSchema.pre('save', function(next) {
    const that = this
    const SALT_FACTOR = 5
    if (!that.isModified('password')) {
        return next()
    }
    return genSalt(that, SALT_FACTOR, next)
})

CuisineUserSchema.methods.comparePassword = function(passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    )
}


CuisineUserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("CuisineUser", CuisineUserSchema);