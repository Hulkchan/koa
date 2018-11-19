// 数据库模块
const mongoose = require('mongoose')
const config = require('../config')

// Mongoose 自带的  Promise 不提供 catch
mongoose.Promise = global.Promise

exports.mongoose = mongoose

// 数据库
exports.connect = () => {
    // 连接数据库
    mongoose.connect(config.MONGODB.uri, { useNewUrlParser: true })

    // 连接错误
    mongoose.connection.on('error', error => {
        console.log(config.MONGODB.uri)
        console.log(error)
        console.log('数据库连接失败')
    })

    // 连接成功
    mongoose.connection.once('open', () => {
        console.log('数据库连接成功!')
    })
}