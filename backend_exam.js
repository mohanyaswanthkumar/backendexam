const http = require('http');

const fs = require('fs');

const url = require('url');

const exam = http.createServer((request, resp) => {
    const { path, query } = url.parse(request.url, true);
    if (request.method === 'POST' && path === '/createFile') {
        let body = "";
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            const { filename, content, password } = JSON.parse(body);
            if (!filename || !content) {
                resp.writeHead(400);
                return resp.end('Invalid input');
            }
            if (password !== 'optionalPassword') {
                resp.writeHead(401);
                return resp.end('Unauthorized access');
            }

            fs.writeFile(filename, content, err => {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error writing file');
                }
                resp.writeHead(200);
                resp.end('File created successfully');
            });
        });
    } else if (request.method === 'GET' && path=== '/getFiles') {
        fs.readdir(__dirname, (err, files) => {
            if (err) {
                resp.writeHead(500);
                return resp.end('Error reading folder');
            }
            resp.writeHead(200, { 'Content-Type': 'application/json' });
            resp.end(JSON.stringify(files));
        });
    } else if (request.method === 'GET' && path === '/getFile') {
        const { filename, password } = query;
        if (!filename) {
            resp.writeHead(400);
            return resp.end('Invalid input ');
        }
        if (password !== 'optionalPassword') {
            resp.writeHead(401);
            return resp.end('Unauthorized access');
        }

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                resp.writeHead(400);
                return resp.end('File not found');
            }
            resp.writeHead(200, { 'Content-Type': 'text/plain' });
            resp.end(data);
        });
    } else {
        resp.writeHead(404);
        resp.end('Not Found');
    }
});

exam.listen(8080, () => {
    console.log('Node JS Server is running on 8080 port');
});
