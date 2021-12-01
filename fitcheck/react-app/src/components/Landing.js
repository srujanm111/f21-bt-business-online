/* FITCHECK
 * WEB FRONTEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// Landing (index/home) page view

import '../common';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Landing.css';

import main1  from '../assets/main1.svg';
import main2 from '../assets/main2.svg';
import main3 from '../assets/main3.svg';
import bottomNav from '../assets/bottomNav.svg';
import login from '../assets/login.svg';
import signup from '../assets/signup.svg';

class Landing extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    
    }
    componentWillUnmount() {

    }

    redirectPage(page = global.config.auth_home_view) {
        this.props.history.push(`/${page}`);
    }

    render() {
        return (
        <div>
            <div className = "text">
                <h1>
                    Check out these fits!
                </h1>
            </div>
            <div className = "box1">
                <img src={main1} alt = "" />
            </div>
            <div className = "box2">
                <img src={main2} alt = "" />
            </div>
            <div className = "box3">
                <img src={main3} alt = "" />
            </div>

            <div className = "login">
            
            <NavLink to="/login"> <img src={login} alt = "" /> </NavLink>
            </div>
            <div className = "signup">
                <NavLink to="/register"> 
                <img src={signup} alt = "" />
                </NavLink>
            </div>


            <div className = "bottomBar">
                <img src={bottomNav} alt = "" />
            </div>
            </div>
        );
    }
}

export default withRouter(Landing);