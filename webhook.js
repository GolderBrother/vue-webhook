const http = require('http');
const crypto = require('crypto');
// 子进程
const { spawn } = require('child_process');
// github上配置的密钥
const SECRET = 'zyh87609364??';
// 发送邮件功能
const sendMail = require('./sendMail');

// 根据特定的算法(sha1)，加上在github上配置的secret,生成一个签名
function sign(body) {
    // update：加密的文本，digest：输出hex编码的16进制字符串
    let secret = `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`;
    return secret;
}
const server = http.createServer(function(req, res){
    console.log(req.method, req.url);
    if(req.url === '/') {
        res.end('Hello webhook~~');
    }
    if(req.method === 'POST' && req.url === '/webhook') {
        let buffers = [];
        req.on('data', function(buffer){
            // 收起发过来的数据
            buffers.push(buffer);
        });
        req.on('end', function(){
            console.log('buffers: %o', buffers); 
            const body = Buffer.concat(buffers);
            // 获取请求的事件类型
            const event = req.headers['x-github-event'];//event=push
            //github请求来的时候，要传递请求体body,另外还会传一个signature(加密签名过的)过来，你需要验证签名对不对
            const signature = req.headers['x-hub-signature'];
            if(sign(body) !== signature){
                res.end('Not Allowed')
            }
            // 通知github接收成功
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ok: true}));
            // post请求就开始自动部署
            if(event === 'push') {
                const payload = JSON.parse(body);
                // 找脚本，开个子进程去执行这个脚本
                const child = spawn('sh', [`./${payload.repository.name}.sh`]);
                child.stdout.on('data', (buffer) => {
                    buffers.push(buffer);
                });
                child.stdout.on('end', () => {
                    let logs = Buffer.concat(buffers).toString();
                    const mailMessage = `
                        <h1>部署日期: ${new Date()}</h1>
                        <h2>部署人: ${payload.pusher.name}</h2>
                        <h2>部署邮箱: ${payload.pusher.email}</h2>
                        <h2>提交信息: ${payload.head_commit&&payload.head_commit['message']}</h2>
                        <h2>布署日志: ${logs.replace("\r\n",'<br/>')}</h2>
                    `;
                    sendMail(mailMessage);
                })
            }
        });
    }else {
        res.end('Not Found');
    }
});

server.listen(4000, ()=> {
    console.log('webhook服务已经在4000端口上启动')  
})