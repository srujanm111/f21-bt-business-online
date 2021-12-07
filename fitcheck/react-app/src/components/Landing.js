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
        // global.api.authenticate((is_authenticated => {
        //     if (is_authenticated) this.redirectPage();
        // }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage(page = global.config.auth_home_view) {
        this.props.history.push(`/${page}`);
    }

    render() {
        return (
            <div className="center h100">
                <Container>
                    <Row>
                        <Col>
                            <div className="centerTitle">
                                <h1 className="title titleFont"> FitCheck </h1>
                            </div>
                        </Col>
                    </Row>
                    <div className="homepageOptions">
                        <NavLink className="f100" to="/login"> Sign In </NavLink>
                        <NavLink className="f100" to="/register"> Sign Up </NavLink>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withRouter(Landing);