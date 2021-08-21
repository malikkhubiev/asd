const Router = require('express')
const controller = require('./authController.js')
const {check} = require('express-validator')
const {authMiddleware} = require('./middlewares/authMiddleware.js')
const {roleMiddleware} = require('./middlewares/roleMiddleware.js')

const router = new Router()

router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть не меньше 4 и не больше 20 символов').isLength({min: 4, max: 20})
], controller.registration)

router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router