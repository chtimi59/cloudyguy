import { combineReducers } from 'redux';
import { AppReducer } from './AppReducer';

const rootReducer = combineReducers<ReduxState>({
    app: AppReducer
});

export default rootReducer;
