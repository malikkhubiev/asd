const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter.js')

const PORT = process.env.PORT || 5000
const URI = process.env.URI || 'MongoDBURL'

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

const startApp = async () => {
    try {
        await mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true})
        app.listen(PORT, ()=>`Server started on port ${PORT}`)
    } catch (e) {
        console.log(e)
    }
}

startApp()