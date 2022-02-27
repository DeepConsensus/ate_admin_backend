const model = require('../models/user')
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
        const user = new model(req)
        user.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(removeProperties(item))
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
exports.updatePersonalItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { personal_details: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateEducationItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { education_details: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateOccupationItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { occupation_details: inputdata };
        if (id) {
            res.status(200).json(await db.updateItem(id, model, saveobj))
        }

    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.updateReligiousItem = async(req, res) => {
    try {
        const inputdata = req.body;
        const id = await utils.isIDGood(req.params.id);
        const saveobj = { religious_details: inputdata };
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

exports.updateSummaryItem = async(req, res) => {
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
 * Get all Featured Film
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRecommendedPeople = async(req, res) => {
    try {
        const query = await db.checkQueryString(req.query);
        const cast = (req.user.religious_details ? req.user.religious_details.cast : '');
        const subcast = (req.user.religious_details ? req.user.religious_details.sub_cast : '');
        const newquery = { $or: [{ "religious_details.cast": new RegExp('^' + cast + '$', "i") }, { "religious_details.sub_cast": new RegExp('^' + subcast + '$', "i") }] };
        let finalquery = "";
        if (!_.isEmpty(query)) {
            finalquery = {...query, ...newquery };
        } else {
            finalquery = newquery;
        }
        const results = await db.getItemByDifferentField(req, model, finalquery);
        const updateresult = [];
        results.docs.map((item) => {
            const obj = {
                _id: item._id,
                name: (item.personal_details ? item.personal_details.full_name : ''),
                age: (item.personal_details ? utils.calculateAge(item.personal_details.dob) : ''),
                designation: (item.occupation_details ? item.occupation_details.designation : ''),
                height: (item.personal_details.height ? item.personal_details.height : ''),
                weight: (item.personal_details.weight ? item.personal_details.weight : ''),
                summary: (item.summary ? item.summary : ''),
                photos: (item.photos ? item.photos : ''),
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            };
            if (req.user.contact_number !== item.contact_number) {
                updateresult.push(obj);
            }

        });
        delete results.docs;
        results.totalDocs = results.totalDocs - 1;
        results.data = updateresult;
        res.status(200).json(results);
    } catch (error) {
        utils.handleError(res, error);
    }
};

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