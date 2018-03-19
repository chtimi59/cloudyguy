const express = require('express')
const { spawnSync, execSync } = require( 'child_process' )
const path = require('path')
const fs = require('fs');
const app = express()
const https = require('https');
const http = require('http');
const port = 80;
const ovpns='/home/pi/ovpns/';
const pki='/etc/openvpn/easy-rsa/pki/'
const credentials = {
    key: fs.readFileSync(`${pki}/private/ca.key`),
    cert: fs.readFileSync(`${pki}/ca.crt`)
};

app.get('/ovpn', function (req, res) {
    var id = req.query.id;
    if (id===undefined) {
        const ls = spawnSync( 'ls', [ '-1', ovpns ] );
        let data = [];
        for(let file of ls.stdout.toString().split(/\r?\n/)) {
            if (path.extname(file) == ".ovpn") data.push(file);
        }
        res.json(data);
    } else {
        const fileName = `${id}.ovpn`;
        const path = `${ovpns}${fileName}`;
        if (!fs.existsSync(path)) {
            res.status(404).send('Not found');
        } else {
            const curl = spawnSync("curl -s checkip.dyndns.org --max-time 3 | sed -e 's/.*Current IP Address: //' -e 's/<.*$//'", [], {shell: true})
            if (curl.status !== 0) {
                res.status(500).send('Busy');
            } else {
                publicip = curl.stdout.toString();
                if (!publicip) publicip='';
                publicip = publicip.replace(/\s+/g, ' ').trim();
                if (publicip=='') {
                    res.status(500).send('Busy');
                } else {
                    let data = fs.readFileSync(path).toString();
                    data = data.replace("PUBLIC_IP", publicip);
                    res.writeHead(200, {
                        'Content-Type': `application/octet-stream`,
                        'Content-Disposition': `attachment; filename="${fileName}"`
                    });
                    res.end(data, 'binary');
                }
            }
        }
    }
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

const server = http.createServer(credentials, app);
server.on('error', (e) => { console.err(e); process.exit(1); })
server.on('listening', () => { console.log('Listening on ' + port); });
server.listen(port);