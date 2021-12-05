
import '../common';
import React from 'react';
import { withRouter } from "react-router-dom";
import bottomNav from '../assets/bottomNav.svg';
import clothes_border  from '../assets/clothes_border.svg';
import fit_border from '../assets/fit_border.svg';
import save_fit from '../assets/save_fit.svg';
import clear from '../assets/clear.svg';
import '../styles/Create.css';
import PropTypes from "prop-types";

class Create extends React.Component{

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    
    };
    handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
    }
  
    componentDidMount() {

    }
    componentWillUnmount() {

    }

    render() {
        return (

        <div>
            <div className = "clothe_border">
                <img src={clothes_border} alt = "" />
            </div>
            <div className = "buttonStyle">
               <button> Image</button>
            </div>
            
        
        
            <div className = "fits_border">
                <img src={fit_border} alt = "" />
            </div>

            <div className = "save_outfit">
                <img src={save_fit} alt = "" />
            </div>

            <div className = "clear">
                <img src={clear} alt = "" />
            </div>

            <div className = "bottomNav">
                <img src={bottomNav} alt = "" />
            </div>

   
        </div>

        );
    }
    
}

export default withRouter(Create);