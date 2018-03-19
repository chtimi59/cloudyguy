import { Store } from 'redux';

export interface Config {
}

export class Config {
    private static _instance: Config;

    public store: Store<ReduxState>;

    private constructor() {
    }

    // Is it a good approch to do a singleton ?
    public static get isInstance(): boolean { return (!!Config._instance) }
    public static get instance(): Config {
        if (!Config._instance) Config._instance = new this();
        return Config._instance;
    }
}
