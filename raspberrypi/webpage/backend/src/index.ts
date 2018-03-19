import { config } from './config';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';

// middlewares
import * as cookieParser from 'cookie-parser';
import { environment } from './middlewares/environment';
import { httpAccessControl } from './middlewares/httpAccessControl';

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
        --localCORS: allow //localhost:8080 (typical webpack server's config for dev)
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
            config.applicationPath = arg;
            break;
        }
        if (name == 'localCORS') {
            config.AccessControlAllowOrigin = "//localhost:8080";
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

if (config.port == null) config.port = config.protocol == 'http' ? 80 : 443;
config.applicationPath = path.resolve(config.applicationPath);
if (!fs.existsSync(config.applicationPath)) cliError(`'${config.applicationPath}' path not found!`);
config.AccessControlAllowOrigin = config.protocol + config.AccessControlAllowOrigin;

const app = express();
app.use(cookieParser());
app.use(environment(config));
app.use(httpAccessControl());

app.use('/', require('./path/root')); // - default

var server = null;
switch (config.protocol) {
    case 'http': server = http.createServer(app); break;
    case 'https': {
        if (!fs.existsSync(config.certificate_path)) cliError(`'${config.certificate_path}' certificate not found`);
        const certificate = fs.readFileSync(config.certificate_path, 'utf8');
        if (!fs.existsSync(config.privatekey_path)) cliError(`'${config.privatekey_path}' private key not found`);
        const privateKey  = fs.readFileSync(config.privatekey_path, 'utf8');
        const credentials = {key: privateKey, cert: certificate};
        server = https.createServer(credentials, app);
    }
}
server.on('error', (e) => {
    console.error(e);
    process.exit(1);
})
server.on('listening', () => {
    console.log(config.protocol + ' Listening on ' + config.port);
});
console.log(`Server running version ${config.version}`);
console.log(`Serving ${config.applicationPath}`);

server.listen(config.port);

if (config.verbose>0)
{
    // setRawMode not available in production, so guard against usage
    if (typeof process.stdin.setRawMode === 'function') {
        /* Clear screen when SPACEBAR key is pressed */
        process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(key){
        const ClearScreen = "\x1B[2J\x1B[;H";
        if ( key === '\u0003') process.exit(); //CTRL-C
        if (key === '\u0020') console.log(ClearScreen); // space-bar
        if (key === '\u0008') console.log(ClearScreen); // back-space
        if (key === '\u001b\u005b\u0033\u007e') console.log(ClearScreen); // delete(?)
    });
}