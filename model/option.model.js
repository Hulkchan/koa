const mongoose = require('../mongodb').mongoose

const optionSchema = new mongoose.Schema({
    // 网站标题
    title: {
        type: String,
        required: true,
        default: ''
    },
    // 网站副标题
    sub_title: {
        type: String,
        required: true,
        default: ''
    },
    // 关键字
    keyword: {
        type: String,
        default: ''
    },
    // 网站描述
    description: {
        type: String,
        default: ''
    },
    // 站点网址
    url: {
        type: String,
        default: ''
    },
    // 网站官邮
    email: {
        type: String,
        default: ''
    },
    // 备案号
    icp: {
        type: String,
        default: ''
    },
    meta: {
        like: {
            type: Number,
            default: 0
        }
    }
})

const Option = mongoose.model('Option', optionSchema)

module.exports = Option