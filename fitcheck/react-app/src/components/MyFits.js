
import '../common';
import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import bottomNav from '../assets/bottomNav.svg';
import outfit1  from '../assets/outfit1.svg';
import outfit2 from '../assets/outfit2.svg';
import outfit3 from '../assets/outfit3.svg';
import outfit4 from '../assets/outfit4.svg';
import '../styles/MyFits.css';
import PropTypes from "prop-types";

class MyFits extends React.Component{

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

  
    componentDidMount() {
        // global.api.authenticate((is_authenticated => {
        //     if (is_authenticated) this.redirectPage();
        // }).bind(this));
    }
    componentWillUnmount() {

    }

    render() {
        return (

// inside your render or return
<div className>

    <div className = "fit1">
        <img src={outfit1} alt = "" />
    </div>
    <div className = "fit2">
        <img src={outfit2} alt = "" />
    </div>
    <div className = "fit3">
        <img src={outfit3} alt = "" />
    </div>
    <div className = "fit4">
        <img src={outfit4} alt = "" />
    </div>
    <div className = "bottomNav">
        <img src={bottomNav} alt = "" />
    </div>

</div>


     
        //    <img className="bottomNav" src={bottomNav}
        //     className="fit1" src={outfit1}
        //     className="fit2" src={outfit2} 
        //     className="fit3" src={outfit3}
        //     className="fit4" src={outfit4} />
            
        );
    }
    
}

export default withRouter(MyFits);