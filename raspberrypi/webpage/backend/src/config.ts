import * as path from 'path'
const packageJson = require('./../package.json');

const easyRsaPath = '/etc/openvpn/easy-rsa/pki/'

export let config: Config = {
	protocol: 'http',
	port: null,
	AccessControlAllowOrigin: null,
	version: packageJson['version'],
	applicationPath: 'dist',
	verbose: 0,
	logDate: true,
	privatekey_path: `${easyRsaPath}/private/ca.key`,
	certificate_path: `${easyRsaPath}/ca.crt`,
	/* openvpn */
	easyRsaPath
};
