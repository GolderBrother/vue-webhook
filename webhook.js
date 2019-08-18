const http = require('http');
const server = http.createServer(function(req, res){
    console.log(req.method, req.url);
    if(req.url === '/') {
        res.end('Hello webhook');
    }
    if(req.method === 'POST' && req.url === '/webhook') {
        let buffers = [];
        req.on('data', function(buffer){
            buffers.push(buffer);
        });
        req.on('end', function(){
            // const body =
            console.log('buffers: %o', buffers); 
        });
        // 通知github接收成功
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ok: true}));
    }else {
        res.end('Not Found');
    }
});

server.listen(4000, ()=> {
    console.log('webhook服务已经在4000端口上启动')  
})