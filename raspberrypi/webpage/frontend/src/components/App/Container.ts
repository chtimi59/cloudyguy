import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router-dom'
import * as rcom from './Component';
import * as xact from "../../actions";

interface P {}

const mapStateToProps = (s: ReduxState) => {
    let values: rcom.PValues = {
    };
    return { values }
};

export const Container = withRouter(connect(mapStateToProps)(rcom.Component));
