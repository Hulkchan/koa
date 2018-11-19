/**
 * 七牛云控制器 **/

const qn = require("qiniu");
const config = require("../config");
const path = require("path");
const fs = require("fs");
const { handleSuccess } = require("../utils/handle");

class QNController {
    // 获取七牛云Token
    static async getQN(ctx) {
        const file = ctx.request.files.file;
        const mac = new qn.auth.digest.Mac(
            config.QINIU.accessKey,
            config.QINIU.secretKey
        );
        const options = {
            scope: config.QINIU.bucket
        };
        const putPolicy = await new qn.rs.PutPolicy(options);
        const uploadToken = await putPolicy.uploadToken(mac);
        var uploadConfig = await new qn.conf.Config();
        // 空间对应的机房
        uploadConfig.zone = qn.zone.Zone_z0;
        // 是否使用https域名
        //config.useHttpsDomain = true;
        // 上传是否使用cdn加速
        //config.useCdnDomain = true;
        var formUploader = await new qn.form_up.FormUploader(uploadConfig);
        var putExtra = await new qn.form_up.PutExtra();
        var readableStream = fs.createReadStream(file.path); // 可读的流
        var key = file.name;
        await new Promise((resolved, reject) => {
            formUploader.putStream(
                uploadToken,
                key,
                readableStream,
                putExtra,
                function(respErr, respBody, respInfo) {
                    if (respErr) {
                        handleError({ ctx, message: "上传失败", result: respErr });
                    }
                    if (respInfo.statusCode == 200) {
                        handleSuccess({ 
                            ctx, 
                            message: "上传成功", 
                            result: { 
                                url: config.QINIU.origin + respBody.key 
                            }
                        })
                        resolved(respBody);
                    } else {
                        resolved(respBody);
                        handleError({ ctx, message: "上传失败", result: respErr });
                        // handleError({ ctx, message: "上传失败" });
                    }
                }
            );
        });
    }
    // 上传图片到本地
    static async uploadImg(ctx) {
        const file = ctx.request.files.file;
        const reader = fs.createReadStream(file.path);
        let filePath =
            path.join(process.cwd(), "public/upload/") + `/${file.name}`;
        const uploadStream = fs.createWriteStream(filePath);
        reader.pipe(uploadStream);
        if (uploadStream) {
            handleSuccess({ ctx, result: filePath, message: "上传图片成功" });
        }
    }
}

module.exports = QNController;
