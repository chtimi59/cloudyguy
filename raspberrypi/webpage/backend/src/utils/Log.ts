import { FormatDate } from './utils';

let chalk;
try { chalk = require('chalk'); } catch (e) {}

export class Log {
    
    public logDate: boolean
    public level: number
    public transcationId?: string

    constructor(config: Config, id?: string) {
        this.logDate = config.logDate;
        this.level = config.verbose;
        if (id) this.transcationId = id;
    }

    private _log(s) {
        if (!this.logDate) return console.log(s);
        let st = FormatDate()
        if (this.transcationId) st += ` [${this.transcationId}]`;
        if (chalk) st = chalk.grey(st);
        console.log(`${st} ${s}`);
    }

    // verbose levels : all
    public log(s: any) {
        this._log(s);
    }
    public err(s: any) {
        this._log('\x1b[31m');
        console.error(s);
        this._log('\x1b[0m')
    }
    
    // verbose levels : 1
    public info(s: string) {
        if (this.level < 1) return;
        if (chalk) s = chalk.white(s);
        this._log(s);
    }
    public warn(s: string) {
        if (this.level < 1) return;
        if (chalk) s = chalk.yellow(s);
        this._log(s);
    }
    public title(protocol: string, method: string, path: string) {
        if (this.level < 1) return;
        const isAPI = path.match(/^\/[^\.\/]+$/) ? true : false;
        let s = `${protocol.toUpperCase()} ${method.toUpperCase()} ${path}`;
        if (this.level >= 2) { this.l2_title(isAPI, s); return; }
        if (chalk) s = (!isAPI) ? chalk.grey(s) :  chalk.white(s);
        this._log(s);
    }
    public reponse(s: string) {
        if (this.level < 1) return;
        if (chalk) s = chalk.black.bgWhite(s);
        this._log(s);
    }
    public reponseError(s: string) {
        if (this.level < 1) return;
        if (chalk) s = chalk.white.bgRed(s);
        this._log(s);
    }

    // verbose levels : 2
    private l2_title(isAPI: boolean, s: string) {
        if (this.level < 2) return;
        if (chalk) s = (!isAPI) ? chalk.grey(s) :  chalk.white.bgGreen(s);
        this._log(s);
    }
    public subtitle(s: string) {
        if (this.level < 2) return;
        if (chalk) s = chalk.green(s);
        this._log(s);
    }
    public subtask(s: string) {
        if (this.level < 2) return;
        if (chalk) s = chalk.grey(s);
        this._log(s);
    }

   // verbose levels : 3
    public detail(s: string) {
        if (this.level < 3) return;
        if (chalk) s = chalk.grey(s);
        this._log(s);
    }
}