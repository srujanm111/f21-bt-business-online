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
  

class Navbar extends React.Component{
     render() {
        return (
         
          <>
            <Nav>

            <NavLink to='/' activeStyle>
              <img className = "logo" src={logo} alt='logo' />
            </NavLink>
      
              <NavMenu>
             
                <NavLink to= '/landing' activeStyle>
                  HOME
                </NavLink>
                <NavLink to='/login' activeStyle>
                  CREATE
                </NavLink>
                <NavLink to='/MyFits' activeStyle>
                  MY FITS 
                </NavLink>
                <NavLink to='/register' activeStyle>
                  WARDROBE
                  <img className = "logo" src={logo} alt='logo' />
                </NavLink>
           
              </NavMenu>
       
            </Nav>
         
          </>
        );
      };
      
}
export default withRouter(Navbar);