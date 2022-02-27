const controller = require('../controllers/promocodes')
const validate = require('../controllers/promocodes.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const trimRequest = require('trim-request')


/*
 * Get all items route
 */
router.get('/', controller.getItems)

/*
 * Get items route
 */
router.get(
    '/list',
    controller.getAllItems
)

/*
 * Get item route
 */
router.get(
    '/get/:id',
    // requireAuth,
    //AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.getItem,
    controller.getItem
)

/*
 * Create new item route
 */
router.post(
    '/',
    // requireAuth,
    // AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.createItem,
    controller.createItem
)

/*
 * Get item route
 */
router.get(
    '/:id',
    requireAuth,
    AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.getItem,
    controller.getItem
)

/*
 * Update item route
 */
router.patch(
    '/:id',
    // requireAuth,
    // AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.updateItem,
    controller.updateItem
)

/*
 * Delete item route
 */
router.delete(
    '/:id',
    // requireAuth,
    // AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.deleteItem,
    controller.deleteItem
)



module.exports = router