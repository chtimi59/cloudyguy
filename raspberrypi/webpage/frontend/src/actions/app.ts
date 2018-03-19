import * as type from './actionsTypes';
import { Config } from './../Config';

export const copy = (state?: AppState): AppState => {
    if (!state) state = Config.instance.store.getState().app;
    return JSON.parse(JSON.stringify(state));
}

export function setAuthStatus(data: any) {
    return {
      type: type.SET_AUTH_STATUS,
      data
    };
}