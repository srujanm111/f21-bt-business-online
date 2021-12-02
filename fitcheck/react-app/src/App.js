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
import MyFits from "./components/MyFits";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/Register">
          <Register></Register>
          </Route>
          <Route path="/">
          <MyFits></MyFits>
           {/* <Landing></Landing> */}
          </Route>
          <Route path="/MyFits">
            <MyFits></MyFits>
          </Route>
        </Switch>
      </Router >
    </div >
  );
}

export default App;