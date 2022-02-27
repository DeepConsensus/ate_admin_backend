const mongoose = require('mongoose')
const requestIp = require('request-ip')
const { validationResult } = require('express-validator')

const crypto = require('crypto')

const secret = process.env.JWT_SECRET
const algorithm = 'aes-192-cbc'
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
const key = crypto.scryptSync(secret, 'salt', 24)
const iv = Buffer.alloc(16, 0) // Initialization crypto vector


exports.generatePassword = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return encrypted
  }

/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) => {
    return file.split('.').slice(0, -1).join('.').toString()
}

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = (req) => requestIp.getClientIp(req)

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = (req) => req.headers['user-agent']

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = (req) =>
    req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX'

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
    // Prints error in console
    if (process.env.NODE_ENV === 'development') {
        console.log(err)
    }
    // Sends error to user
    res.status(err.code).json({
        errors: {
            msg: err.message
        }
    })
}

exports.returnSuccess = (res, err, result) => {
    res.status(200).json({
        result: {
            isSuccess: true,
            message: 'Success',
            data: result
        }
    })
}

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
    return {
        code,
        message
    }
}

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase()
        }
        return next()
    } catch (err) {
        return this.handleError(res, this.buildErrObject(200, err.array()))
    }
}

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = (message) => {
    return {
        msg: message
    }
}



/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
exports.isIDGood = async(id) => {
    return new Promise((resolve, reject) => {
        const goodID = mongoose.Types.ObjectId.isValid(id)
        return goodID ?
            resolve(id) :
            reject(this.buildErrObject(422, 'ID_MALFORMED'))
    })
}

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemNotFound = (err, item, reject, message) => {
    if (err) {
        reject(this.buildErrObject(422, err.message))
    }
    if (!item) {
        reject(this.buildErrObject(404, message))
    }
}

/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
    if (err) {
        reject(this.buildErrObject(422, err.message))
    }
    if (item) {
        reject(this.buildErrObject(422, message))
    }
}



exports.convertTime = function(duration) {
    let a = duration.match(/\d+/g)

    if (
        duration.indexOf('M') >= 0 &&
        duration.indexOf('H') == -1 &&
        duration.indexOf('S') == -1
    ) {
        a = [0, a[0], 0]
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]]
    }
    if (
        duration.indexOf('H') >= 0 &&
        duration.indexOf('M') == -1 &&
        duration.indexOf('S') == -1
    ) {
        a = [a[0], 0, 0]
    }

    duration = 0

    if (a.length == 3) {
        duration += parseInt(a[0]) * 3600
        duration += parseInt(a[1]) * 60
        duration += parseInt(a[2])
    }

    if (a.length == 2) {
        duration += parseInt(a[0]) * 60
        duration += parseInt(a[1])
    }

    if (a.length == 1) {
        duration += parseInt(a[0])
    }
    return duration
}

exports.calcualteRate = function(likes, dislikes) {
    const maxNumberOfStars = 5 // Define the maximum number of stars possible.
    const totalRating = likes + dislikes // Calculate the total number of ratings.
    const likePercentageStars = (likes / totalRating) * maxNumberOfStars
    return likePercentageStars
}

exports.formatduration = function(s) {
    return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
}

exports.calculateAge = function(dob) {
    const birthday = new Date(dob);
    const diff = Date.now() - birthday.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

exports.formatResultUsers = function(data, contact_number) {
    const updateresult = [];
    data.map((item) => {
        const obj = {
            _id: item._id,
            name: (item.personal_details ? item.personal_details.full_name : ''),
            age: (item.personal_details ? exports.calculateAge(item.personal_details.dob) : ''),
            designation: (item.occupation_details ? item.occupation_details.designation : ''),
            summary: (item.summary ? item.summary : ''),
            photos: (item.photos ? item.photos : ''),
            height: (item.personal_details.height ? item.personal_details.height : ''),
            weight: (item.personal_details.weight ? item.personal_details.weight : ''),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
        if (contact_number !== item.contact_number) {
            updateresult.push(obj);
        }
    });
    return updateresult;
}