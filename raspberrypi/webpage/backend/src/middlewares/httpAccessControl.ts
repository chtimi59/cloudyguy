import * as express from 'express';
import { MWW, RequestEx } from './../utils/MWW';

export function httpAccessControl()
{
    return (req, res, next) => new class extends MWW<any, void> {
        handler(req: RequestEx, any)
        {
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            if (req.config.AccessControlAllowOrigin) {
                res.setHeader('Access-Control-Allow-Origin', req.config.AccessControlAllowOrigin);
            }
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            if (req.method === 'OPTIONS') {
                res.send(200);
                return;
            }
            this.Next(MWW.VOID);
        }
    }(req, res, next);
}
