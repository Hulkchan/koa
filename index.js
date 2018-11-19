const Koa = require('koa')
const http = require('http')
const path = require('path')
const config = require('./config')
/**
 * koa-body 用来从 POST 请求的数据体里面提取键值对
 * 还可以用来处理文件上传 **/
const koaBody = require('koa-body')
/**
 * 通过增加如Strict-Transport-Security, X-Frame-Options
 * X-Frame-Options等HTTP头提高Express应用程序的安全性
 * **/
const helmet = require('koa-helmet')
/**
 * 分页功能 **/
const mongoosePaginate = require('mongoose-paginate')
/**
 * 跨域 **/
const cors = require('koa2-cors')

const mongodb = require('./mongodb')
const router = require('./route')

const app = new Koa()

mongodb.connect()

mongoosePaginate.paginate.options = {
    limit: config.APP.LIMIT
}

app.use(cors({
    origin: function (ctx) {
        return '*'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))

app.use(async (ctx, next) => {
    const start = new Date();
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(helmet())

app.use(koaBody({
    jsonLimit: '10mb', // JSON 数据体的大小限制
    formLimit: '10mb', // 限制表单请求体的大小
    textLimit: '10mb', // 限制 text body 的大小
    // 文件上传
    multipart: true,
    formidable:{
        uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => { // 文件上传前的设置
          // console.log(`name: ${name}`);
          // console.log(file);
        }
    }
}))

// 404 500
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        console.log(error)
        ctx.body = { code: 0, message: '服务器内部错误' }
    }
    if (ctx.status === 404 || ctx.status === 405) {
        ctx.body = {
            code: 0,
            message: '无效的API请求'
        }
    }
})

app.use(router.routes())

// start server
http.createServer(app.callback()).listen(config.APP.PORT, () => {
    console.log(`node-Koa Run! port at ${config.APP.PORT}`)
})