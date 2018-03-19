import * as React from 'react';
import { Router } from 'react-router-dom'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { App } from './components/App';
import { Config } from './Config';
import createMemoryHistory from 'history/createMemoryHistory'

import * as xact from './actions/';
import configureStore from "./store/configureStore";

const root = document.getElementById("appRoot");
if (root == null) { console.error('no DOM root node'); }

Config.instance.store = configureStore({});

export default class AppRoot {
    constructor() {
        render(
            <Router history={createMemoryHistory()}>
                <Provider store={Config.instance.store}>
                    <App />
                </Provider>
            </Router>
            , root)
    }
}
