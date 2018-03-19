import './style.scss';
import * as React from 'react';

export interface P {
    values: PValues,
    actions: PActions
}
export interface PValues { }
export interface PActions { }
export interface S { }
export class Component extends React.Component<P, S>{

    constructor(props) {
        super(props)
    }

    render() {
        <div className="app">
            Hello World!
        </div>
    }
}
