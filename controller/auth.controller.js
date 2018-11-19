/**
 * 登录控制器 
 * 1. login 登录
 * 2. getAuth 获取用户信息
 * 3. putAuth 修改用户信息 **/

const Auth = require("../model/auth.model");
const config = require("../config");

const { handleError, handleSuccess } = require("../utils/handle");

const jwt = require("jsonwebtoken");
// 加密
const crypto = require("crypto");
// md5 编码
const md5Decode = pwd => {
    return crypto
        .createHash("md5")
        .update(pwd)
        .digest("hex");
};

class AuthController {
    // 登录
    // 加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用
    static async login(ctx) {
        const {
            username,
            password
        } = ctx.request.body

        const auth = await Auth
                .findOne({ username })
                .catch(err => ctx.throw(500, '服务器内部错误'))
        if(auth) {
            // 存在账号且密码匹配
            if(auth.password === md5Decode(password)) {
                const token = jwt.sign({
                    name: auth.name,
                    password: auth.password,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
                }, config.AUTH.jwtTokenSecret)
                handleSuccess({
                    ctx,
                    result: {
                        token,
                        lifeTime: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), 
                        message: "登录成功",
                    }
                })
            } else {
                // 账号存在密码不匹配
                handleError({ ctx, message: "密码错误!" })
            }
        } else {
            // 账号不存在
            handleError({ ctx, message: "账户不存在!" })
        }

    }

    // 获取用户信息
    static async getAuth (ctx) {
        const auth = await Auth
                    .findOne({}, 'name username slogan gravatar')
                    .catch(err => ctx.throw(500, '服务器内部错误'))
        if (auth) {
            handleSuccess({
                ctx,
                result: auth,
                message: '获取用户资料成功'
            })
        }else {
            handleError({ ctx, message: "获取用户资料失败!" })
        }
    }

    // 修改用户信息
    static async putAuth (ctx) {
        const {
            _id,
            name,
            username,
            slogan,
            gravatar,
            oldPassword,
            newPassword
        } = ctx.request.body
        const _auth = await Auth
                    .findOne({}, '_id name slogan gravatar password')
                    .catch(err => ctx.throw(500, '服务器内部错误'))
        if (_auth) {
            if (_auth.password !== md5Decode(oldPassword)) {
                handleError({ ctx, message: "原密码错误" })
            }else {
                // 新密码为空，默认使用旧密码
                const password = newPassword === '' ? oldPassword : newPassword
                let auth = await Auth
                                .findByIdAndUpdate(
                                    _id,
                                    // 要更新的参数
                                    {
                                        _id,
                                        name,
                                        username,
                                        slogan,
                                        gravatar,
                                        password: md5Decode(password)
                                    },
                                    {
                                        // true to return the modified document rather than the original. defaults to false
                                        new: false
                                    }
                                )
                                .catch(err => ctx.throw(500, '服务器内部错误'))
                if (auth) {
                    handleSuccess({
                        ctx,
                        result: auth,
                        message: '修改用户资料成功'
                    })
                }else {
                    handleError({
                        ctx,
                        message: '修改用户资料失败'
                    })
                }
            }
        } else {
            handleError({
                ctx,
                message: '修改用户资料失败'
            }) 
        }
    }
}

module.exports = AuthController
