import { Log } from './../utils/Log';
import { FormatDate } from './../utils/utils';
import { MWW, RequestEx } from './../utils/MWW';
//import { TokenCookie } from './../utils/TokenCookie';

import * as express from 'express';
import * as url from 'url';

export function environment(config: Config)
{
    let transactionCount = 0; // used for debug

    return (req, res, next) => new class extends MWW<any, void> {
        handler(req: RequestEx, input: any)
        {
            // project config
            req.config = config;
            // attach and id, to this transaction (for debug)
            req.id = `${transactionCount++}`;
            // request date
            req.unixdate = new Date().getTime();
            // attach log to req
            req.log = new Log(config, req.id);
            this.log = req.log;

            // log for this transaction
            this.log.subtitle('');
            this.log.subtitle('------------');
            this.log.title(req.protocol, req.method, req.path);
            this.log.subtitle(FormatDate(req.unixdate));
            let qs = url.parse(req.url).query;
            let qsa = qs ? qs.split('&') : [];
            for (let s of qsa) this.log.subtitle(` o ${s}`);
            if (req.hostname=="localhost") this.log.subtitle("hostname: localhost");
            this.log.detail('cookies:');
            this.log.detail(JSON.stringify(req.cookies, null, 4));
            this.log.subtitle('----------');

            this.Next(MWW.VOID);

        }
    }(req, res, next);
}




