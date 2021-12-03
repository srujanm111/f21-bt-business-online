/* FITCHECK
 * WEB FRONTEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// Register page view

import '../common';

import axios from 'axios';
import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Register.css';
import { utils } from 'hash.js';


class Register extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            // email: "",
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

    // updateEmail(event) {
    //     this.setState({
    //         email: event.target.value
    //     });
    // }

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
        // var email = this.state.email;
        var password = this.state.password;
        if (username && username.trim().length > 0) {
            // if (email && email.trim().length > 0) {
            if (password && password.trim().length > 0) {
                if (global.util.validateAlphanumeric(username)) {
                    password = global.util.hashPassword(password);
                    if (sendRequest) this.requestSignUp(username, /* email, */ password);
                } else this.updateErrorMsg('Invalid username (letters and numbers only).');
            } else this.updateErrorMsg('Invalid password (empty).');
            // } else this.updateErrorMsg('Invalid email (empty).');
        } else this.updateErrorMsg('Invalid username (empty).');
    }

    checkEnter(event) {
        if (event && event.keyCode == 13) {
            this.validateForm(true);
        }
    }

    redirectPage(force = false, page = global.config.auth_home_view) {
        if (!force) {
            this.props.history.push(`/${page}`);
        } else {
            window.location = String(`${window.location.origin}/${page}?first=true`);
        }
    }

    requestSignUp(username, /* email, */ password) {
        const unknown_error_msg = "Registration server error.";
        axios.post(`${global.config.api_url}/sign_up`, {
            new_username: `${username}`,
            // email: `${email}`,
            new_password: `${password}`
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('token')) {
                this.setState({ errorMsg: "" });
                global.api.login(response.data.token, false);
                this.redirectPage(true);
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
                <div className="centerTitle">
                    <h1 className="registerTitle titleFont">Sign Up</h1>
                </div>
                <div className="defaultFormClass" style={{ marginTop: '7px' }}>
                    Username: <input type="text" id="username" placeholder="username" onChange={this.updateUsername.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br />
                    {/* Email: <input type="email" id="email" placeholder="name@email.com" onChange={this.updateEmail.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br /> */}
                    Password: <input type="password" id="password" placeholder="********" onChange={this.updatePassword.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br />
                    <Button variant="outlined" color="default" style={{ marginTop: '12px' }} onClick={this.validateForm.bind(this, true)}> Sign Up </Button>
                </div>
                <span className="errorMessage">{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default withRouter(Register);