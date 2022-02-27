const controller = require('../controllers/users')
const validate = require('../controllers/users.validate')
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
    requireAuth,
    AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    validate.getItem,
    controller.getItem
)

/*
 * Update item route
 */
router.patch(
    '/personal/:id',
    requireAuth,
    AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    controller.updatePersonalItem
)

router.patch(
    '/education/:id',
    requireAuth,
    AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    controller.updateEducationItem
)

router.patch(
    '/occupation/:id',
    requireAuth,
    AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    controller.updateOccupationItem
)

router.patch(
    '/religious/:id',
    requireAuth,
    AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    controller.updateReligiousItem
)

router.patch(
    '/images/:id',
    requireAuth,
    AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    controller.updateImagesItem
)

router.patch(
    '/summary/:id',
    requireAuth,
    AuthController.roleAuthorization(['USER', 'ADMIN']),
    trimRequest.all,
    controller.updateSummaryItem
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