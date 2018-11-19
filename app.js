const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')

const app = new Koa()
app.use(bodyParser())

const router = require('koa-router')()
app.use(router.routes())
app.listen(9982)
console.log('app started at port 9982...')

// 连接mongoose
const db = mongoose.connect("mongodb://localhost/testDB")

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
})
var User = mongoose.model('User',UserSchema)

// 新增数据
var user = {
    username: 'ydj',
    password: '123123',
    email: ''
}

var newUser = new User(user)
newUser.save()

router.get('/', async (ctx, next) => {
    let val = null
    const data = await User.findOne({username: 'ydj'})
    console.log('data', data)
    const result = {
        code: 200,
        response: data,
        ts: 12345
    }
    ctx.response.body = result
    return result
})