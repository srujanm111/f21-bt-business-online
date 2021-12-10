import '../common'

import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Row } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { NavLink, withRouter } from "react-router-dom";

import "../styles/Navbar.css";

import pfp_asset from '../assets/pfp.svg';
import logo_asset from '../assets/logo.svg';


class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            color: "#FE9EB9",
            showMenu: false,
        };
    }

    componentDidMount() {
        global.api.authenticate((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }

    redirectPage() {
        window.location = String(`${window.location.origin}/`);
    }

    setupPage(user) {
        // console.log('Settings: loading user ' + user.username);
        // // console.log("list is " + user.email);
        // axios.get(`${global.config.api_url}/user?username=${user.username}`, {
        //     headers: { Authorization: `Bearer ${user.token}` }
        // }).then(response => {
        //     var resp_data = null;
        //     if (response && response.data)
        //         resp_data = response.data;
        //     // console.log('resp_data', resp_data);
        //     if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username) {
        //         // console.log('Settings: setup user', user);
        //         var color = resp_data.data.navColor;
        //         // console.log(color);
        //         if (color === null || color == "") {
        //             color = "#010101";
        //             console.log("color is null");
        //         }
        //         // TODO: setup settings with user
        //         this.setState({
        //             color: color
        //         });
        //     } else console.log('Invalid response: ', resp_data);
        // }).catch(error => {
        //     if (error) {
        //         var resp_data = null;
        //         if (error.response && error.response.data)
        //             resp_data = error.response.data;
        //         console.log(error);
        //     }
        // });
    }

    toggleMenu() {
        this.setState({
            showMenu: !(this.state.showMenu)
        });
    }

    clickAvatar() {
        this.toggleMenu();
    }

    clickLogout() {
        if (window.confirm("Leave FitCheck?")) {
            setTimeout(_ => {
                global.api.logout();
            }, 50);
        }
    }

    render() {
        var active = this.props.active;
        console.log(`NavBar.active: ${active}`);
        return (
            <AppBar position="fixed" id="navbar" style={{ backgroundColor: this.state.color, color: 'white' }}>
                <Toolbar>
                    {/* <Typography variant="h6" style={{ transform: 'scale(1.02)' }}>
                        FitCheck
                    </Typography> */}
                    {/* <Button variant="contained" color="default" id="logoutButton" onClick={global.api.logout} >
                        Sign Out
                    </Button> */}
                    <div id="logo_wrap">
                        <NavLink to='/'>
                            <img className="logo" src={logo_asset} alt='logo' />
                        </NavLink>
                    </div>
                    <div id="links">
                        {/* <NavLink to='/home' className={(active == 'home' ? "nlink_a" : "nlink_i").toString()}>
                            Home
                        </NavLink> */}
                        <NavLink to='/create' className={(active == 'create' ? "nlink_a" : "nlink_i").toString()}>
                            Create
                        </NavLink>
                        <NavLink to='/fits' className={(active == 'fits' ? "nlink_a" : "nlink_i").toString()}>
                            {/*My */}Outfits
                        </NavLink>
                        <NavLink to='/wardrobe' className={(active == 'wardrobe' ? "nlink_a" : "nlink_i").toString()}>
                            Wardrobe
                        </NavLink>
                    </div>
                    <IconButton edge="start" color="inherit" id="avatar_button" onClick={_ => { this.clickAvatar(); }}>
                        <Avatar alt="FC" src={pfp_asset} style={{ height: '50px', width: '50px' }} />
                    </IconButton>
                    <div style={{ display: (this.state.showMenu ? 'block' : 'none'), position: 'fixed', top: '85px', right: '0', height: '60px', width: '170px', backgroundColor: 'white', borderRadius: '0 0 0 10px', border: '1px solid #f5f5f5', borderTop: 'none', borderRight: 'none', boxShadow: '0 3px 6px 2px rgba(0, 0, 0, 0.07)' }}>
                        <button onClick={_ => { this.clickLogout(); }} className="logoutButton" style={{ letterSpacing: '1px', fontSize: '19px', height: '100%', width: '100%', border: 'none', outline: 'none', color: '#373737', borderRadius: '0 0 0 10px' }}>LOGOUT</button>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }

}

export default withRouter(NavBar);