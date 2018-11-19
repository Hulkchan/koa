const config = require('../config')
const controller = require('../controller')
const Router = require('koa-router')

const router = new Router({
	prefix: config.APP.ROOT_PATH
})

// API

router.get('/', (ctx, next) => {
    ctx.response.body = config.INFO
}).get(
    '/auth',
    controller.auth.getAuth
).put(
    '/auth',
    controller.auth.putAuth
).post(
    '/login',
    controller.auth.login
).get(
    '/option',
    controller.option.getOption
).put(
    '/option',
    controller.option.putOption
).get(
    '/tag',
    controller.tag.getTags
).post(
    '/tag',
    controller.tag.postTag
).patch(
    '/tag', 
    controller.tag.patchTag
).put(
    '/tag',
    controller.tag.putTag
).delete(
    '/tag/:id',
    controller.tag.deleteTag
).post(
    '/getArticle',
    controller.article.getArts
).post(
    '/article',
    controller.article.postArt
).delete(
    '/article/:id',
    controller.article.deleteArt
).put(
    '/article/:id',
    controller.article.putArt
).patch(
    '/article/:id',
    controller.article.patchArt
).get(
    '/article/:id',
    controller.article.getArtById
).post(
    '/imgUpload',
    controller.qiniu.getQN
).post(
    '/like',
    controller.like.postLike
)

module.exports = router
