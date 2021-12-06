/* FITCHECK
 * WEB FRONTEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// app main view

import './common';

import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login from "./components/Login";
import Register from "./components/Register";
import Landing from "./components/Landing";
import Fits from "./components/Fits";
import Navbar from "./components/Navbar";
import Home from './components/Home';
import Wardrobe from './components/Wardrobe';
import Create from './components/Create';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/create">
                        <Navbar active="create"></Navbar>
                        <Create></Create>
                    </Route>
                    <Route path="/wardrobe">
                        <Navbar active="wardrobe"></Navbar>
                        <Wardrobe></Wardrobe>
                    </Route>
                    <Route path="/fits">
                        <Navbar active="fits"></Navbar>
                        <Fits></Fits>
                    </Route>
                    <Route path="/home">
                        <Navbar active="home"></Navbar>
                        <Home></Home>
                    </Route>
                    <Route path="/login">
                        <Login></Login>
                    </Route>
                    <Route path="/register">
                        <Register></Register>
                    </Route>
                    <Route path="/">
                        <Landing></Landing>
                    </Route>
                </Switch>
            </Router >
        </div >
    );
}

export default App;