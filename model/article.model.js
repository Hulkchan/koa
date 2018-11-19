/**
 * 文章数据模型 **/

const mongoose = require("../mongodb").mongoose;
const autoIncrement = require("mongoose-auto-increment");
const mongoosePaginate = require("mongoose-paginate");
const moment = require('moment')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection);

const articleSchema = new mongoose.Schema({
    // 文章标题
    title: {
        type: String,
        required: true
    },
    // 关键字
    keyword: {
        type: String,
        required: true
    },
    // 描述
    description: {
        type: String,
        required: false
    },
    // 标签
    tag: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    // 内容
    content: {
        type: String,
        required: true
    },
    // 状态 1 发布/ 2 草稿
    state: {
        type: Number,
        default: 1
    },
    // 文章公开状态 1 公开 / 2 私密
    publish: {
        type: Number,
        default: 1
    },
    // 缩略图
    thumb: String,
    // 文章分类 1 code / 2 think
    type: {
        type: Number
    },
    // 发布日期
    created_at: {
        type: Date,
        default: Date.now//moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    // 最后修改日期
    update_at: {
        type: Date,
        default: Date.now//moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    // 其他元素信息
    meta: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        }
    }
})

// 转化成普通 JavaScript 对象
articleSchema.set('toJSON', { getters: true, virtuals: true });
articleSchema.set('toObject', { getters: true, virtuals: true });
// 时间格式化处理 更改时间返回格式
articleSchema.path('created_at').get(function (v) {
    return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
articleSchema.path('update_at').get(function (v) {
    return moment(v).format('YYYY-MM-DD HH:mm:ss')
})

// 翻页 + 自增ID 插件配置
articleSchema.plugin(mongoosePaginate)
articleSchema.plugin(autoIncrement.plugin, {
	model: 'Article',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})

// 时间更新
articleSchema.pre('findOneAndUpdate', function (next) {
    this.findOneAndUpdate({}, { update_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') })
    next()
})

// 文章模型
const Article = mongoose.model('Article', articleSchema)

module.exports = Article