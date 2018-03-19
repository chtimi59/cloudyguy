interface Config {
    protocol: 'http'|'https'
    privatekey_path: string|null,
    certificate_path: string|null,
    port: number|null,
    AccessControlAllowOrigin: string|null;
    version: string,
    applicationPath: string,
    verbose: number,
    logDate: boolean,
    /* openvpn */
    easyRsaPath: string
}
