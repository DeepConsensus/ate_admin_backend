const controller = require('../controllers/notice')
const validate = require('../controllers/notice.validate')
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
router.get('/', AuthController.authuser(), controller.getItems)

/*
 * Get items route
 */
router.get('/list', AuthController.authuser(), controller.getAllItems)

/*
 * Create new item route
 */
router.post(
  '/',
  AuthController.authuser(),
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

/*
 * Get item route
 */
router.get(
  '/get/:id',
  AuthController.authuser(),
  trimRequest.all,
  validate.getItem,
  controller.getItem
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  AuthController.authuser(),
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  AuthController.authuser(),
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

/*
 * Create New Push Notification Item
 */
router.post(
  '/push-notification/',
  AuthController.authuser(),
  trimRequest.all,
  validate.createPushItem,
  controller.createPushNotificationItem
)

router.get('/push-notification/list', controller.getItemsPushNotification)

module.exports = router
