const controller = require('../controllers/settings')
const validate = require('../controllers/settings.validate')
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
 * Get items route
 */
router.get('/', controller.getItems)



/*
 * Get item route
 */
router.get(
    '/get/:id',
    //  requireAuth,
    //  AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    validate.getItem,
    controller.getItem
)



/*
 * Update item route
 */
router.patch(
    '/site/:id',
    //  requireAuth,
    // AuthController.roleAuthorization(['USER', 'ADMIN']),
    //  trimRequest.all,
    controller.updateSiteItem
)

router.patch(
    '/payment/:id',
    //  requireAuth,
    //  AuthController.roleAuthorization(['USER', 'ADMIN']),
    //  trimRequest.all,
    controller.updatePaymentItem
)

router.patch(
    '/productorder/:id',
    //  requireAuth,
    //  AuthController.roleAuthorization(['USER', 'ADMIN']),
    //  trimRequest.all,
    controller.updateproductOrderItem
)

router.patch(
    '/app/:id',
    //   requireAuth,
    //   AuthController.roleAuthorization(['USER', 'ADMIN']),
    //   trimRequest.all,
    controller.updateAppItem
)

router.patch(
    '/images/:id',
    //   requireAuth,
    //   AuthController.roleAuthorization(['USER', 'ADMIN']),
    //   trimRequest.all,
    controller.updateImagesItem
)

router.patch(
    '/social/:id',
    // requireAuth,
    //   AuthController.roleAuthorization(['USER', 'ADMIN']),
    //  trimRequest.all,
    controller.updateSocialItem
)


router.put(
    '/',
    // requireAuth,
    // AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    controller.createNewItem
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