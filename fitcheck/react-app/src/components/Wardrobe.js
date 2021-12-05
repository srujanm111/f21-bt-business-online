
import '../common';
import React from 'react';
import { withRouter } from "react-router-dom";
import bottomNav from '../assets/bottomNav.svg';
import wardrobe  from '../assets/wardrobe.svg';
import infoText  from '../assets/infoText.svg';
import sweaterDetails from '../assets/sweaterDetails.svg';
import product from '../assets/product.svg';
import '../styles/Wardrobe.css';
import PropTypes from "prop-types";

class Wardrobe extends React.Component{

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };
  
    componentDidMount() {

    }
    componentWillUnmount() {

    }

    render() {
        return (

        <div>
            <div className = "clothes_border">
                <img src={wardrobe} alt = "" />
            </div>
          
        
            <div className = "fit_border">
                <img src={sweaterDetails} alt = "" />
            </div>
            <div className = "infoText">
                <img src={infoText} alt = "" />
            </div>
            <div className = "product">
            <a href="https://rb.gy/4c4btz">
            <img src={product} />
            </a>
      
            
            </div>

            <div className = "bottomNav">
                <img src={bottomNav} alt = "" />
            </div>

            
   
        </div>

        );
    }
    
}

export default withRouter(Wardrobe);