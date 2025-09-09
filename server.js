const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 5000;
const hostname = '0.0.0.0';

const server = http.createServer((req, res) => {
    // Handle favicon requests
    if (req.url === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Serve index.html for all requests
    const filePath = path.join(__dirname, 'index.html');
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        // Set headers to prevent caching issues in Replit iframe
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(data);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log('Website is ready!');
});