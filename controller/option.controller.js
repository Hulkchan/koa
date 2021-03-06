/**
 * 网站配置信息
 * 1. 获取网站配置信息
 * 2. 修改网站配置信息 **/
const Option = require('../model/option.model')
const {
    handleSuccess,
    handleError
} = require('../utils/handle')

class OptionController {
    // 获取信息
    static async getOption (ctx) {
        const option = await Option
                            .findOne()
                            .catch(err => {
                                ctx.throw(500, '服务器内部错误')
                            })
        if (option) {
            handleSuccess({
                ctx,
                result: option,
                message: '获取配置信息成功'
            })
        }else {
            handleError({ ctx, message: '获取配置项失败'})
        }
    }

    // 修改/新增 配置信息
    static async putOption (ctx) {
        const _id = ctx.request.body._id
        const option = await (_id
                            ? Option.findByIdAndUpdate(_id, ctx.request.body, { new: true })
                            : new Option(ctx.request.body).save())
                            .catch(err => ctx.throw(500, '服务器内部错误'))
        if (option) {
            handleSuccess({ ctx, result: option._id, message: '修改配置项成功' })
        }else {
            handleError({ ctx, message: '修改配置项失败' }) 
        }
    }
}

module.exports = OptionController