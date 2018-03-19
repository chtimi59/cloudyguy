import { MWW, RequestEx } from './../utils/MWW';
import * as express from 'express';

const root = (req, res, next) => new class extends MWW<void, void> {
    handler(req: RequestEx) {
        //return express.static(req.config.applicationPath)(req, res, next);
        res.send('Hello World!')
    }
}(req, res, next);


module.exports = [ root ]