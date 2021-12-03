/* FITCHECK
 * WEB FRONTEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// Home (returning user) page view

import '../common';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Landing.css';

import createBox from '../assets/createBox.svg';
import recentBox from '../assets/recentBox.svg';
import inspiredBox from '../assets/inspiredBox.svg';
import bottomNav from '../assets/bottomNav.svg';
import login from '../assets/login.svg';
import signup from '../assets/signup.svg';

class Home extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        global.api.authenticate((result => {
            if (!result.success) this.redirectPage();
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage(page = global.config.landing_view) {
        this.props.history.push(`/${page}`);
    }

    render() {
        return (
            <div>
                <div className="text">
                    <h1>
                        Check out those fits!
                    </h1>
                </div>
                <div className="createBox">
                    <img src={createBox} alt="" />
                </div>
                <div className="recentBox">
                    <img src={recentBox} alt="" />
                </div>
                <div className="inspiredBox">
                    <img src={inspiredBox} alt="" />
                </div>
            </div>
        );
    }
}

export default withRouter(Home);