import * as type from './../actions/actionsTypes';
import * as xact from '../actions';

const initialState: AppState = {

};

export const AppReducer = (state: AppState = initialState, action) => {
    switch (action.type)
    {
        case type.SET_AUTH_STATUS: {
            //let v: OnLineStatus = action.data;
            let newState = xact.app.copy(state);
            //newState.onLineStatus = v;
            return newState;
        }
        default:
            return state;
    }
};
