const nodemailer = require('nodemailer')
// https://segmentfault.com/a/1190000012251328?utm_source=tag-newest
const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // 这边可以换成微信通知、短信通知等
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
        user: '1204788939@qq.com',
        // 这里密码不是qq密码，是你设置的smtp授权码
        // 确保发件的qq邮箱已经开通了smtp服务，开通方法：https://jingyan.baidu.com/article/6079ad0eb14aaa28fe86db5a.html
        pass: 'umhksbyfxxvfhejc'
    }
})

function sendMail(message) {
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"1204788939" <1204788939@qq.com>', // 发送地址
        to: '1204788939@qq.com', // 接收者，可以传入多个，以分号隔开
        subject: '部署通知 ✔', // 主题
        // text: 'Hello world?', // plain text body
        html: message // 内容主体
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

}

module.exports = sendMail;