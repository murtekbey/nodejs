const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    /*

    // res.setHeader('Content-Type', 'text/plain');
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.statusMessage = 'OK';

    res.write('<html>');
    res.write('<head><title>Muboys</title></head>');
    res.write('<body><h1>Hello World from Nodejs Server</h1></body>')
    res.write('</html>');
    res.end();

    */

    fs.readFile('indexx.html', function (error, file) {

        if (error) {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.statusMessage = 'OK';
            res.end('Dosya bulunamadı');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.end(file);
        }
    });
});

server.listen(3000);
console.log('Listening port on 3000...');