import '../common';

import React from 'react';
import { withRouter } from "react-router-dom";
import '../styles/Navbar.css';
import logo from '../assets/logo.svg';

import {
    Nav,
    NavLink,
    NavMenu,
} from './NavbarElements';


class Navbar extends React.Component {
    render() {
        return (
            <Nav>
                <NavLink to='/'>
                    <img className="logo" src={logo} alt='logo' />
                </NavLink>
                <NavMenu>
                    <NavLink to='/landing'>
                        HOME
                    </NavLink>
                    <NavLink to='/login'>
                        CREATE
                    </NavLink>
                    <NavLink to='/MyFits'>
                        MY FITS
                    </NavLink>
                    <NavLink to='/register'>
                        WARDROBE
                        <img className="logo" src={logo} alt='logo' />
                    </NavLink>
                </NavMenu>
            </Nav>
        );
    };
}
export default withRouter(Navbar);