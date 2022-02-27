const controller = require('../controllers/cuisines')
const validate = require('../controllers/cuisines.validate')
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
  '/:id',
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

router.patch(
  '/images/:id',
  AuthController.authuser(),
  //   trimRequest.all,
  controller.updateCusioneImageItem
)

module.exports = router
