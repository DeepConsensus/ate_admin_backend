const controller = require('../controllers/restaruranttype')
const validate = require('../controllers/restauranttype.validate')
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
router.get('/all', controller.getAllItems)

/*
 * Get items route
 */
router.get(
    '/list',
    controller.getAllItems
)

/*
 * Create new item route
 */
router.post(
    '/',
    // requireAuth,
    // AuthController.roleAuthorization(['admin']),
    // trimRequest.all,
    // validate.createItem,
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
    '/update/:id',
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
    requireAuth,
    AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.deleteItem,
    controller.deleteItem
)
module.exports = router