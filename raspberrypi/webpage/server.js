const cookieParser = require('cookie-parser');
const express = require('express')
const https = require('https');
const http = require('http');
const { spawnSync, execSync } = require( 'child_process' )
const path = require('path')
const fs = require('fs');
const ovpns='/home/pi/ovpns/';
const pki='/etc/openvpn/easy-rsa/pki/'
const credentials = {
    key: fs.readFileSync(`${pki}/private/ca.key`),
    cert: fs.readFileSync(`${pki}/ca.crt`)
};
const packageJson = require('./package.json');


// Server config
let config = {
    protocol: 'http',
    port: null,
    servePath: "dist",
    version: packageJson.version
};

// CLI
const showUsage = () => {
    console.log(`
    Usage ${path.basename(process.argv[1])} [options]

    options:
        --help: show usage
        --port=number: port number
        --protocol=http|https: protocol type
        --verbose=number: 0=quiet
        --path=PATH: path to server (default 'dist')
        --version: show version
    `);
};
const cliError = (msg) => {
    console.error(msg);
    process.exit(1);
}

for (let i = 2; i < process.argv.length; i++) {
    const entry = process.argv[i].split('=');
    const name = entry[0];
    const arg = entry[1];
    do {
        if (name == '-h' || name == '--help') {
            showUsage();
            process.exit(0);
            break;
        }
        if (name == '--version') {
            console.log(config.version);
            process.exit(0);
            break;
        }
        if (name == '--port') {
            if (arg == undefined) cliError(`'${name}' missing argument`);
            let v = Number(arg);
            if (v < 0 || v > 65536) cliError(`RangeError:'${name}' argument must be >= 0 and < 65536`)
            config.port = v;
            break;
        }
        if (name == '--protocol') {
            if (arg == undefined) cliError(`'${name}' missing argument`);
            switch (arg.toUpperCase()) {
                case 'HTTP': config.protocol = 'http'; break
                case 'HTTPS': config.protocol = 'https'; break
                default: cliError(`'${name}' invalid argument`);
            }
            break;
        }
        if (name == '--path') {
            if (arg == undefined) cliError(`'${name}' missing argument`);
            if (!fs.existsSync(arg)) cliError(`invalid path '${arg}'`)
            if (!fs.statSync(arg).isDirectory()) cliError(`invalid path '${arg}'`)
            config.servePath = arg;
            break;
        }
        if (name == '-v' || name == '--verbose') {
            if (arg == undefined) cliError(`'${name}' missing argument`);
            let v = Number(arg);
            if (v < 0) cliError(`RangeError:'${name}' argument must be >= 0`)
            config.verbose = v;
            break;
        }
        showUsage();
        cliError(`unknown '${name}' option`);
    } while (0);
}
// default port
if (config.port == null) config.port = config.protocol == 'http' ? 80 : 443;

/*app.get('/ovpn', function (req, res) {
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
});*/

const app = express()
app.use(cookieParser());

app.get('/', function (req, res) {
  res.send('Hello World!')
})

const server = http.createServer(credentials, app);
server.on('error', (e) => { console.err(e); process.exit(1); })
server.on('listening', () => { console.log('Listening on ' + port); });
server.listen(port);