/**
 * 文章控制器 **/

const Article = require('../model/article.model')
const {
    handleSuccess,
    handleError
} = require('../utils/handle')
const authIsVerified = require('../utils/auth')
// const request = require('request')
const config = require('../config/index')

class ArticleController {
    // 获取文章列表
    static async getArts (ctx) {
        const {
            current_page = 1,
            page_size = 10,
            keyword = '',
            state = 1,
            publish = 1,
            tag,
            type,
            startTime,
            endTime,
            hot
        } = ctx.request.body

        // 过滤条件
        const options = {
            sort: { created_at: -1 },
            page: Number(current_page),
            limit: Number(page_size),
            populate: [{
                path: 'tag',
                select: 'name'
            }],
            select: '-content'
        }

        // 参数
        const querys = {}

        // 关键词查询
        if (keyword) {
            const keywordReg = new RegExp(keyword)
            querys['$or'] = [
                { 'title': keywordReg },
                { 'content': keywordReg },
                { 'description': keywordReg }
            ]
        }

        // 按照state查询
        if ([1, 2].includes(state)) {
            querys.state = state
        }

        // 按照公开程度查询
        if ([1, 2].includes(publish)) {
            querys.publish = publish
        }

        // 按照类型程度查询
        if ([1, 2].includes(type)) {
            querys.type = type
        }

        // 按照类型程度查询
        if (hot) {
            options.sort = {
                'meta.views': -1,
                'meta.likes': -1,
                'meta.comments': -1
            }
        }

        // 时间查询
        if (startTime && endTime) {
            querys.created_at = {
                '$gte': startTime,
                '$lt': endTime
            }
        }

        // 标签
        if (tag) {
            querys.tag = tag
        }

        // 查询
        const result = await Article
                            .paginate(querys, options)
                            .catch(err => ctx.throw(500, '服务器内部错误'))
        if (result) {
            handleSuccess({
                ctx,
                result: {
                    pagination: {
                        total: result.total,
                        current_page: result.page,
                        total_page: result.pages,
                        page_size: result.limit
                    },
                    list: result.docs
                },
                message: '列表数据获取成功!'
            })
        } else {
            handleError({ ctx, message: '获取列表数据失败'})
        }
    }

    // 新增文章
    static async postArt (ctx) {
        const res = new Article(ctx.request.body)
                    .save()
                    .catch(err => console.log(err))
        if (res) {
            handleSuccess({ ctx, message: '添加文章成功' })
        }else {
            handleError({ ctx, message: '添加文章失败' })
        }
    }

    // 修改文章
    static async putArt (ctx) {
        const _id  = ctx.params.id
        const {
            title,
            keyword,
        } = ctx.request.body
        delete ctx.request.body.create_at
        delete ctx.request.body.update_at
        delete ctx.request.body.meta
        if (!_id) {
            handleError({ ctx, message: '无效参数' })
            return false
        }

        if (!title || !keyword) {
            handleError({ ctx, message: 'title, keyword必填' })
            return false
        }

        const res = await Article
                        .findByIdAndUpdate(_id, ctx.request.body)
                        .catch(err => console.log(err))
        if (res) {
            handleSuccess({ ctx, message: '更新文章成功' })
        } else {
            handleError({ ctx, message: '更新文章失败' })
        }
    }

    // 修改文章状态
    static async patchArt (ctx) {
        const _id = ctx.params.id

        const { state, publish } = ctx.request.body

        const querys = {}

        if (state) {
            querys.state = state
        }

        if (publish) {
            querys.publish = publish
        }

        if (!_id) {
            handleError({ ctx, message: "无效参数" })
            return false
        }

        const res = await Article
                        .findByIdAndUpdate(_id, querys)
                        .catch(err => ctx.throw(500, '服务器内部错误'))
        if (res) {
            handleSuccess({ ctx, message: "更新文章状态成功" })
        } else {
            handleError({ ctx, message: "更新文章状态失败" })
        }
    }

    // 删除文章
    static async deleteArt (ctx) {
        const _id = ctx.params.id
        if(!_id) {
            handleError({ ctx, message: '无效参数' })
            return false
        }
        const res = await Article
                        .findByIdAndRemove(_id)
                        .catch(err => ctx.throw(500, '服务器内部错误'))
        if (res) {
            handleSuccess({ ctx, message: '删除文章成功' })
        } else {
            handleError({ ctx, message: '删除文章失败' })
        }
    }

    static async getArtById (ctx) {
        const _id = ctx.params.id

        if (!_id) {
            handleError({ ctx, message: '无效参数' })
            return false
        }
        const res = await Article
                        .findById(_id)
                        .populate('tag')
                        .catch(err => ctx.throw(500, '服务器内部错误'))
        if (res) {
            // 每次请求，文章views增加一次
            res.meta.views += 1
            res.save()
            handleSuccess({ ctx, message: '文章获取成功', result: res })
        } else {
            handleError({ ctx, message: '获取文章失败' })
        }
    }
}

module.exports = ArticleController