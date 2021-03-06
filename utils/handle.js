/**
 * 公共解析器 **/

exports.handleError = ({ ctx, message = '请求失败', err = null}) => {
    ctx.body = {
        code: 0,
        message, 
        debug: err
    }
}

exports.handleSuccess = ({ ctx, message, result = null}) => {
    ctx.body = {
        code: 1,
        message,
        result
    }
}