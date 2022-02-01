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
import '../styles/Home.css';

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
        this.state = {
            inspiration_message_first: "Check out those fits!",
            inspiration_message_second: "Take it home!"
        };
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

    createNewFitButton() {
        console.log('create new fit');
    }

    mostRecentFitButton() {
        console.log('most recent fit');
    }

    getInspired() {
        console.log('get inspired');
    }

    openOutfit(outfit_num) {
        console.log(`open outfit ${outfit_num}`);
    }

    render() {
        return (
            <div style={{ marginTop: '135px', textAlign: 'left' }}>
                <div style={{ width: '90%', margin: '0 auto' }}>
                    <h1 className="homepage_inspiration_message">{this.state.inspiration_message_first}</h1>
                </div>
                <div className="homepage_box_wrapper">
                    <div className="homepage_box">
                        <button className="homepage_box_content" onClick={_ => { this.createNewFitButton(); }}>
                            <h1>Create<br />New<br />Fit</h1>
                        </button>
                    </div>
                    <div className="homepage_box">
                        <button className="homepage_box_content" onClick={_ => { this.mostRecentFitButton(); }}>
                            <h1>Most<br />Recent<br />Fit</h1>
                        </button>
                    </div>
                    <div className="homepage_box">
                        <button className="homepage_box_content" onClick={_ => { this.getInspired(); }}>
                            <h1>Get<br />Inspired</h1>
                        </button>

                    </div>
                </div>
                <div style={{ width: '90%', margin: '70px auto 0' }}>
                    <h1 className="homepage_inspiration_message" style={{ letterSpacing: '1.5px' }}>{this.state.inspiration_message_second}</h1>
                </div>
                <div className="homepage_preview_wrapper">
                    <div className="homepage_preview">
                        <button className="homepage_preview_content" onClick={_ => { this.openOutfit(1); }}></button>
                    </div>
                    <div className="homepage_preview">
                        <button className="homepage_preview_content" onClick={_ => { this.openOutfit(2); }}></button>
                    </div>
                    <div className="homepage_preview">
                        <button className="homepage_preview_content" onClick={_ => { this.openOutfit(3); }}></button>
                    </div>
                    <div className="homepage_preview">
                        <button className="homepage_preview_content" onClick={_ => { this.openOutfit(4); }}></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);