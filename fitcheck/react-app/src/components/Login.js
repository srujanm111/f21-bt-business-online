/* FITCHECK
 * WEB FRONTEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// Login page view

import '../common';

import axios from 'axios';
import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";


import bottomNav from '../assets/bottomNav.svg';
import '../styles/Fits.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';

class Login extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errorMsg: ""
        };
    }

    componentDidMount() {
        global.api.authenticate((result => {
            if (result.success) this.redirectPage();
        }).bind(this));
    }
    componentWillUnmount() {

    }

    updateUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    updatePassword(event) {
        this.setState({
            password: event.target.value
        });
    }

    updateErrorMsg(value) {
        this.setState({
            errorMsg: value
        });
    }

    validateForm(sendRequest = false) {
        var username = this.state.username;
        var password = this.state.password;
        if (username && username.trim().length > 0) {
            if (password && password.trim().length > 0) {
                if (global.util.validateAlphanumeric(username)) {
                    password = global.util.hashPassword(password);
                    if (sendRequest) this.requestSignIn(username, password);
                } else this.updateErrorMsg('Invalid username (letters and numbers only).');
            } else this.updateErrorMsg('Invalid password (empty).');
        } else this.updateErrorMsg('Invalid username (empty).');
    }

    checkEnter(event) {
        if (event && event.keyCode == 13) {
            this.validateForm(true);
        }
    }

    redirectPage(page = global.config.auth_home_view) {
        this.props.history.push(`/${page}`);
    }

    requestSignIn(username, password) {
        const unknown_error_msg = "Login server error.";
        axios.post(`${global.config.api_url}/sign_in`, {
            username: `${username}`,
            password: `${password}`
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('token')) {
                this.setState({ errorMsg: "" });
                global.api.login(response.data.token);
                // global.api.login(response.data.token, false);
                // this.redirectPage();
            } else {
                console.error(response);
                this.setState({ errorMsg: unknown_error_msg });
            }
        }).catch(error => {
            console.error(error);
            if (error && error.response && error.response.data && error.response.data.hasOwnProperty('message')) {
                this.setState({ errorMsg: global.util.append_period(error.response.data.message) });
            } else this.setState({ errorMsg: unknown_error_msg });
        });
    }

    render() {
        return (
            <div className="center h100">
                {/* <img className="bottomNav" src={bottomNav} /> */}
                <div className="centerTitle">
                    <h1 className="loginTitle titleFont">Log In</h1>
                </div>


                <div className="defaultFormClass" style={{ marginTop: '7px' }}>
                    Username: <input type="text" id="username" placeholder="username" onChange={this.updateUsername.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br />
                    Password: <input type="password" id="password" placeholder="********" onChange={this.updatePassword.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br />
                    <Button variant="outlined" color="default" style={{ marginTop: '12px' }} onClick={this.validateForm.bind(this, true)}> Sign In </Button>
                </div>
                <span className="errorMessage">{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default withRouter(Login);