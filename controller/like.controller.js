const Article = require('../model/article.model')
const {
    handleSuccess,
    handleError
} = require('../utils/handle')

class LikeController {
    // 添加喜欢
    static async postLike (ctx) {
        const { _id } = ctx.request.body
        if (!_id) {
            handleError({ ctx, message: '无效参数' })
            return false
        }
        // 文章喜欢
        const res  = await Article
                          .findById(_id)
                          .catch(err => ctx.throw(500, '服务器内部错误'))
        if (res) {
            res.meta.likes += 1
            const info = await res
                              .save()
                              .catch(err => ctx.throw(500, '服务器内部错误'))
            if (info) {
                handleSuccess({ ctx, message: '操作成功' })
            } else {
                handleError({ ctx, message: '操作失败' })
            }
        } else {
            handleError({ ctx, message: '操作失败' })
        }
    }
}

module.exports = LikeController