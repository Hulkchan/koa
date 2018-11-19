/**
 * 标签控制器
 * **/

const Tag = require("../model/tag.model")
const Article = require('../model/article.model')
const { handleSuccess, handleError } = require("../utils/handle")
const authIsVerified = require('../utils/auth')

class TagController {
    // 获取标签列表
    static async getTags(ctx) {
        const { current_page = 1, page_size = 10, keyword = "" } = ctx.query

        // 过滤条件
        const options = {
            sort: {
                sort: 1
            },
            page: Number(current_page),
            limit: Number(page_size)
        }

        // 参数
        const querys = {
            name: new RegExp(keyword)
        }
        const tag = await Tag
                        .paginate(querys, options)
                        .catch(err => ctx.throw(500, '服务器内部错误'))
        if (tag) {
            
            let tagClone = JSON.parse(JSON.stringify(tag))

            // 查找拥有相同标签的文章数
            let $match = {}

            // 前台请求时，只有已发布的和公开
            // if(!authIsVerified(ctx.request)) {
            //     $match = {
            //         state: 1,
            //         publish: 1
            //     }
            // }

            const article = await Article.aggregate([
                { $match },
                {
                    $unwind: '$tag'
                },
                {
                    $group: {
                        _id: '$tag',
                        num_tutorial: { $sum: 1 }
                    }
                }
            ])

            if(article) {
                tagClone.docs.forEach(t => {
                    const finded = article.find(c => String(c._id) === String(t._id))
                    t.count = finded ? finded.num_tutorial : 0 
                })
                handleSuccess({
                    ctx,
                    result: {
                        pagination: {
                            total: tag.total,
                            current_page: tag.page,
                            total_page: tag.pages,
                            page_size: tag.limit
                        },
                        list: tagClone.docs
                    },
                    message: '列表数据获取成功!'
                })
            }else {
                handleError({
                    ctx,
                    message: '获取标签列表失败'
                })
            }

        } else {
            handleError({
                ctx,
                message: '获取标签列表失败'
            })
        }
    }

    // 添加标签
    static async postTag(ctx) {
        const {
            name,
            description
        } = ctx.request.body

        // 添加前先验证是否有相同 name
        const res = await Tag
                        .find({ name })
                        .catch(err => 
                            handleError({
                                ctx,
                                message: '服务器内部错误'
                            })
                        )
        if(res && res.length !== 0) {
            handleError({
                ctx,
                message: '已存在相同标签名'
            })
            return false
        }
        // 新增标签
        const tag = await new Tag({
            name,
            description
        })
        .save()
        .catch(
            err => handleError({
                ctx,
                message: '服务器内部错误'
            })
        )
        if (tag) {
            handleSuccess({
                ctx,
                message: '发布标签成功',
                result: tag
            })
        }else {
            handleError({
                ctx,
                message: '发布标签失败'
            })
        }
    }

    // 标签排序
    static async patchTag(ctx) {
        const { id, sort } = ctx.request.body
        try {
            await Tag
                .findByIdAndUpdate(id, { sort: sort })
                .catch(err => ctx.throw(500, '服务器内部错误'))
            handleSuccess({ ctx, message: '排序成功' })
        } catch (error) {
            console.log(error)
            handleError({ ctx, message: '排序失败' })
        } 
    }
    
    // 修改标签
    static async putTag(ctx) {
        const { _id, name, description } = ctx.request.body

        if (!_id) {
            handleError({ ctx, message: '无效参数' })
            return false
        }

        const res = await Tag
                        .findByIdAndUpdate(
                            _id,
                            {
                                name,
                                description
                            },
                            {
                                new: true
                            }
                        )
                        .catch(err =>  ctx.throw(500, '服务器内部错误'))
        if (res) {
            handleSuccess({ ctx, message: '修改标签成功' })
        } else {
            handleError({ ctx, message: '修改标签失败' })
        }
    }

    // 删除标签
    static async deleteTag (ctx) {
        const _id = ctx.params.id
        if (!_id) {
            handleError({ ctx, message: '无效参数' })
            return false
        }

        let res = await Tag
                    .findByIdAndRemove(_id)
                    .catch(err => ctx.throw(500, '服务器内部错误'))
        if (res) {
            handleSuccess({ ctx, message: '删除数据成功' })
        }else {
            handleError({ ctx, message: '删除数据失败' })
        }
    }
}

module.exports = TagController