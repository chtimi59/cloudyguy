import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

/* MWW stands for MiddleWare-Wrapper
   
   This abstract class is here to brings a little bit more typing in express middleware.
   
   Example:

    * without MWW *
       
       const myMiddleWare = (req, res, next) => {
                let input: res['data'] as InputType;
                let output: OutputType = {};
                [...]
                res['data'] = output;
                this.next();
            }
        }(req, res, next);

    * with MWW<I,O> *

       const myMiddleWare = (req, res, next) => new class extends MWW<InputType, OutputType> {
            handler(req: RequestEx, input: InputType) {
                let output: OutputType = {};
                [...]
                return this.Next(output);
            }
        }(req, res, next);
*/
/*
    Types :
    -------

    I, InputType:
        Input data Object Type comming for the previous middleware
        maybe void or any, if the previous middleware is not requiered

    O, OutType:
        Output data Object Type to send to the next middleware
        maybe void or any, if the previous middleware is not requiered

    RequestEx: 
        extends the original express.Request to add specific project settings
        export interface RequestEx extends express.Request { 
            [...]
        }
*/

import { Log } from './Log';
export interface RequestEx extends express.Request { 
    config: Config; // project config
    log: Log; // plz, steer all log here
    unixdate: number; // request date (for debug/logs)
    id: string; // request id (for debug/logs)
}

/*
    Note, MWW also brings additionnal helpers methods
    ----------------------------------------------------
   
       Next(data: O):           Equivalent to express.next();

       SendOKJson(data: O):     Send 200OK to client with json data in it
       SendOKFile(filePath):    Equivalent to express.sendFile(filePath)
       Redirection():           Equivalent to express.res.redirection()
       BadRequest(msg):         Equivalent to express.res.status(400)
       Unauthorized(msg):       Equivalent to express.res.status(401)
       Forbidden(msg):          Equivalent to express.res.status(403)
       NotFound(msg):           Equivalent to express.res.status(404)
       InternalError(msg):      Equivalent to express.res.status(500)
       
       setCookie(name: string, value: any, options?: Object)   Equivalent to express.res.cookie(name, value, options)
       clearCookie(name: string)                               Equivalent to express.res.clearCookie(name);
 */
export abstract class MWW<I, O> {
    
    public static VOID = (() => {})(); //should be a way to write this

    public log: Log;

    private req: RequestEx;
    private res: express.Response;
    private next: express.NextFunction;
    protected abstract handler(req: RequestEx, data: I): any;

    constructor(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.req = req as RequestEx;
        this.res = res;
        this.next = next;

        this.log = this.req.log;

        // Remove this try/catch in none-production mode
        try {
            this.handler(this.req, res['data'] as I);
        } catch (e) {
            console.error(e);
        }
    }

    protected Next(data: O) {
        this.res['data'] = data;
        this.next();
    }

    // 
    
    protected SendOKJson(data: O) {
        const code = 200;
        if (data == undefined) return this.InternalError(`no data provided`); 
        this.res.status(code).json(data);
        let s = `${code} OK`;
        if (data['errorCode']) {
            const errorCode = data['errorCode'];
            if (errorCode == 0) {
                s += ` [no error]`;
                this.log.reponse(s);
            } else {
                s += ` [error ${data['errorCode']}]`;
                this.log.reponseError(s);
            }
        } else {
            this.log.reponse(s);
        }
        this.log.detail(JSON.stringify(data, null, 4));
    }

    public SendOKFile(filePath: string) {
        filePath = path.resolve(filePath);
        if (!fs.existsSync(filePath)) return this.InternalError(`File Not Found: '${filePath}'`);
        const code = 200;
        this.res.status(code).sendFile(filePath);
        const s = `${code} OK`;
        this.log.reponse(s);
        this.log.detail(`send file ${filePath}`);
    }

    public Redirection(url: string) {
        const s = `3xx Redirection`;
        this.log.reponse(s);
        this.log.detail(url);
        this.res.redirect(url);
    }

    public BadRequest(msg: string) {
        const code = 400;
        const s = `${code} Bad Request`;
        this.log.reponseError(s);
        this.log.detail(msg);
        this.res.status(code).send(msg);
    }

    public Unauthorized(msg: string) {
        const code = 401;
        const s = `${code} Unauthorized`;
        this.log.reponseError(s);
        this.log.detail(msg);
        this.res.status(code).send(msg);
    }

    public Forbidden(msg: string) {
        const code = 403;
        const s = `${code} Forbidden`;
        this.log.reponseError(s);
        this.log.detail(msg);
        this.res.status(code).send(msg);
    }

    public NotFound(msg: string) {
        const code = 404;
        const s = `${code} Not Found`;
        this.log.reponseError(s);
        this.log.detail(msg);
        this.res.status(code).send(msg);
    }

    public InternalError(e: any) {
        const code = 500;
        const s = `${code} Internal Server Error`;
        this.log.reponseError(s);
        this.log.err(e);
        this.res.status(code).send({ message: s, error: e});
    }

    //

    public setCookie(name: string, value: any, options?: Object/*CookieOptions*/) {
        this.log.subtask(`<set cookie '${name}'>`);
        this.res.cookie(name, value, options);
    }

    public clearCookie(name: string) {
        this.log.subtask(`<clear cookie '${name}'>`);
        this.res.clearCookie(name);
    }
}