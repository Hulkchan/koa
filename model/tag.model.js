/**
 * 标签数据模型 **/

const mongoose = require("../mongodb").mongoose;
const autoIncrement = require("mongoose-auto-increment");
const mongoosePaginate = require("mongoose-paginate");
const moment = require('moment')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection);

// 标签模型
const tagSchema = new mongoose.Schema({
    // 标签名称
    name: {
        type: String,
        required: true,
        validate: /\S+/
    },
    // 标签描述
    description: {
        type: String,
        default: ''
    },
    // 发布日期
    create_at: {
        type: Date,
        default: Date.now
    },
    // 最后修改日期
    update_at: {
        type: Date,
        default: Date.now
    },
    // 排序
    sort: {
        type: Number,
        default: 0
    }
})

// 转化成普通 JavaScript 对象
tagSchema.set('toJSON', { getters: true, virtuals: true });
tagSchema.set('toObject', { getters: true, virtuals: true });
// 时间格式化处理 更改时间返回格式
tagSchema.path('create_at').get(function (v) {
    return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
tagSchema.path('update_at').get(function (v) {
    return moment(v).format('YYYY-MM-DD HH:mm:ss')
})

// 分页 (Registers a plugin for this schema)
tagSchema.plugin(mongoosePaginate)
tagSchema.plugin(autoIncrement.plugin, {
	model: 'Tag',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})

// 时间更新 (Defines a pre hook for the document)
tagSchema.pre('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') })
    next()
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag