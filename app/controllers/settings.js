const model = require('../models/settings')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const emailer = require('../middleware/emailer')
const upload = require('../middleware/imageupload');
const multiUpload = upload.array("files", 10);
const _ = require('lodash');



/*********************
 * Private functions *
 *********************/


/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async(req) => {
    return new Promise((resolve, reject) => {
        let gid = ''
        let fid = ''
        if (req.provider && req.provider === 'GOOGLE') {
            gid = req.id
        }
        if (req.provider && req.provider === 'FACEBOOK') {
            fid = req.id
        }
        const user = new model({
            name: req.name,
            email: req.email,
            gid,
            fid,
            avatar: req.avatar,
            type: req.provider.toLowerCase(),
            verification: uuid.v4()
        })
        user.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            // Removes properties with rest operator
            const removeProperties = ({
                // eslint-disable-next-line no-unused-vars
                password,
                // eslint-disable-next-line no-unused-vars
                blockExpires,
                // eslint-disable-next-line no-unused-vars
                loginAttempts,
                ...rest
            }) => rest
            resolve(removeProperties(item.toObject()))
        })
    })
}

/********************
 * Public functions *
 ********************/
exports.createNewItem = async(req) => {
    return new Promise((resolve, reject) => {
        console.log('req ', req.body);
        const user = new model(req.body)
        user.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
        })
    })
}



/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async(req, res) => {
    try {
        const query = await db.checkQueryString(req.query)
        res.status(200).json(await db.getItems(req, model, query))
    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async(req, res) => {
    try {
        req = matchedData(req)
        const id = await utils.isIDGood(req.id)
        res.status(200).json(await db.getItem(id, model))
    } catch (error) {
        utils.handleError(res, error)
    }
}


/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        if (id) {
            res.status(200).json(await db.updateItem(id, model, inputdata))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateSiteItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { site: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updatePaymentItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { payment: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateproductOrderItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { productOrder: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateAppItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { app: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateImagesItem = async(req, res) => {
    try {
        multiUpload(req, res, async function(err) {
            if (err) {
                return res.json({
                    success: false,
                    errors: {
                        title: "Image Upload Error",
                        detail: err.message,
                        error: err,
                    },
                });
            }
            const file = req.files;
            const eachimage = [];
            file.map((item) => {
                var params = {
                    src: item.location,
                    key: item.key,
                    status: 1
                };
                eachimage.push(params);
            });

            const id = await utils.isIDGood(req.params.id);
            const saveobj = { photos: eachimage, status: 1 };
            if (id) {
                res.status(200).json(await db.updateItem(id, model, saveobj))
            }

        });


    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateSocialItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { social: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}


/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async(req, res) => {
    try {
        req = matchedData(req)
        const id = await utils.isIDGood(req.id)
        res.status(200).json(await db.deleteItem(id, model))
    } catch (error) {
        utils.handleError(res, error)
    }
}