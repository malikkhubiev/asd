const User = require('./User.js')
const Role = require('./Role.js')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {id, roles}
    return jwt.sign(payload, secret, {expressIn: '24h'})
}

class authController {
    registration = async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json({message: 'Ошибка при регистрации', errors})
            
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            const hashedPassword = bcrypt.hashSync(password, 3)
            const userRole = await Role.findOne({value: 'USER'})
            const user = await new User({username, password: hashedPassword, role: [userRole.value]})
            await user.save()
            return res.json('Пользователь успешно создан')
        } catch (e) {
            res.status(400).json('Ошибка при регистрации')
        }
    }
    login = async (req, res) => {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) return res.status(400).json({message: 'Пользователя с таким именем нет'})
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) return res.status(400).json({message: 'Неверный пароль'}) 
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            res.status(400).json('Ошибка при входе')
        }
    }
    getUsers = async (req, res) => {
        try {
            const users = await User.find()
            return res.json()
        } catch (e) {
            res.status(500).json('Что-то пошло не так')
        }
    }
}

module.exports = new authController()