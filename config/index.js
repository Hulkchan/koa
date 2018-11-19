const argv = require('yargs').argv

exports.MONGODB = {
    uri: `mongodb://47.106.14.128:${argv.dbport || '27017'}/hulk_blog`,
    username: argv.db_username || 'root',
	password: argv.db_password || 'root'
}

exports.AUTH = {
	jwtTokenSecret: argv.auth_key || 'my_blog',
	defaultUsername: argv.auth_default_username || 'chenqihulk',
	defaultPassword: argv.auth_default_password || '123456'
}

exports.APP = {
    ROOT_PATH: '/api',
    LIMIT: 10,
    PORT: 9982
}

exports.INFO = {
    name: 'The Last Love',
    version: '1.0.0',
    author: 'chenqihulk',
    site: 'http://chenqihulk.cn',
    powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}

exports.QINIU = {
	accessKey: argv.qn_accessKey || 'Z8S84LyFCAoQw6BEpgHNszJ6j16w8g0gkk_enueg',
	secretKey: argv.qn_secretKey || 'Tc6cvJZymUwv7tKj2AsPbhqjws9VUfn__Mi9Om7b',
	bucket: argv.qn_bucket || 'blog',
	origin: argv.qn_origin || 'http://ph3k7f6ae.bkt.clouddn.com/',
	uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/'
}