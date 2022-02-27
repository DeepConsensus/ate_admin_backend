const model = require("../models/delivery-people");
const { matchedData } = require("express-validator");
const utils = require("../middleware/utils");
const upload = require("../middleware/imageupload");
const multiUpload = upload.array("files", 10);
const _ = require("lodash");
const db = require("../middleware/db");

/*********************
 * Private functions *
 *********************/

/**
 * Checks if a category already exists excluding itself
 * @param {string} id - id of item
 * @param {string} name - name of item
 */
const emailPhoneExistsExcludingItself = async(id, name) => {
    return new Promise((resolve, reject) => {
        model.findOne({
                name,
                _id: {
                    $ne: id,
                },
            },
            (err, item) => {
                utils.itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
                resolve(false);
            }
        );
    });
};

/**
 * Checks if a Email id and phone already exists in database
 * @param {string} name - name of item
 */
const emailExists = async(email, phone) => {
    return new Promise((resolve, reject) => {
        model.findOne({
                email,
                phone,
            },
            (err, item) => {
                utils.itemAlreadyExists(
                    err,
                    item,
                    reject,
                    "EMAIL_ID_OR_PHONE_ALREADY_EXISTS"
                );
                resolve(false);
            }
        );
    });
};

/**
 * Gets all items from database
 */
const getAllItemsFromDB = async() => {
    return new Promise((resolve, reject) => {
        model.find({},
            "-updatedAt -createdAt", {
                sort: {
                    name: 1,
                },
            },
            (err, items) => {
                if (err) {
                    reject(utils.buildErrObject(422, err.message));
                }
                resolve(items);
            }
        );
    });
};

/**
 * Checks if a notice already exists excluding itself
 * @param {string} id - id of item
 * @param {string} title - name of item
 */
 const agentExistsExcludingItself = async(id, name) => {
    return new Promise((resolve, reject) => {
        model.findOne({
                name,
                _id: {
                    $ne: id,
                },
            },
            (err, item) => {
                utils.itemAlreadyExists(err, item, reject, "AGENT_ALREADY_EXISTS");
                resolve(false);
            }
        );
    });
};

/********************
 * Public functions *
 ********************/

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getAllItems = async(req, res) => {
    try {
        utils.returnSuccess(res, "", await getAllItemsFromDB());
        // res.status(200).json(await getAllItemsFromDB())
    } catch (error) {
        utils.handleError(res, error);
    }
};

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async(req, res) => {
    try {
        const query = await db.checkQueryString(req.query);
        res.status(200).json(await db.getItems(req, model, query));
    } catch (error) {
        utils.handleError(res, error);
    }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async(req, res) => {
    try {
        req = matchedData(req);
        const id = await utils.isIDGood(req.id);
        res.status(200).json(await db.getItem(id, model));
    } catch (error) {
        utils.handleError(res, error);
    }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async(req, res) => {
    try {
        req = matchedData(req);
        console.log("req.id", req);
        const id = await utils.isIDGood(req.id);
        const doesSignExists = await agentExistsExcludingItself(id, req.name);
        if (!doesSignExists) {
            res.status(200).json(await db.updateItem(id, model, req));
        }
    } catch (error) {
        utils.handleError(res, error);
    }
};

const updateImagesItem = async(req, res) => {
    return new Promise((resolve, reject) => {
        multiUpload(req, res, async function(err) {
            if (err) {
                resolve(false);
                // return res.json({
                //     success: false,
                //     errors: {
                //         title: "Image Upload Error",
                //         detail: err.message,
                //         error: err,
                //     },
                // });
            }
            const file = req.files;
            const eachimage = [];
            file.map((item) => {
                var params = {
                    src: item.location,
                    key: item.key,
                    status: 1,
                };
                eachimage.push(params);
            });
            resolve(eachimage);

            // const id = await utils.isIDGood(req.params.id);
            // const saveobj = { photos: eachimage, status: 1 };
            // if (id) {
            //     res.status(200).json(await db.updateItem(id, model, saveobj))
            // }
        });
    });
};

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async(req, res) => {
    try {
        const doesEmailPhoneExists = await emailExists(
            req.body.email,
            req.body.phone
        );
        if (!doesEmailPhoneExists) {
            res.status(201).json(await db.createItem(req.body, model));
        }
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
        req = matchedData(req);
        const id = await utils.isIDGood(req.id);
        res.status(200).json(await db.deleteItem(id, model));
    } catch (error) {
        utils.handleError(res, error);
    }
};