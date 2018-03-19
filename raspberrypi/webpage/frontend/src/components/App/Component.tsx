import './style.scss';
import * as React from 'react';
import * as ReactBootstrap from 'react-bootstrap';

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
        return(<div className="app">
            Hello World !<br />
            <ReactBootstrap.Button bsStyle="success" >asd</ReactBootstrap.Button >
        </div>)
    }
}
