
import '../common';
import React from 'react';
import axios from 'axios';

import { withRouter } from "react-router-dom";
import bottomNav from '../assets/bottomNav.svg';
import outfit1 from '../assets/outfit1.svg';
import outfit2 from '../assets/outfit2.svg';
import outfit3 from '../assets/outfit3.svg';
import outfit4 from '../assets/outfit4.svg';
import '../styles/MyFits.css';
import PropTypes from "prop-types";

class Fits extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            url1: '',
            url2: '',
            url3: '',
        };
    }

    componentDidMount() {
        global.api.authenticate((result => {
            if (!result.success) this.redirectPage();
            else this.setupPage();
        }).bind(this));
    }
    componentWillUnmount() {

    }

    setupPage() {
        axios.post(`${global.config.api_url}/get_clothing`, {
            token: `${global.api.get_token()}`,
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('list')) {
                console.log(response.data.list);
                this.setState({
                    url1: response.data.list[0].image_path,
                    url2: response.data.list[1].image_path,
                    url3: response.data.list[2].image_path,
                    pUrl1: response.data.list[0].product_url,
                    pUrl2: response.data.list[1].product_url,
                    pUrl3: response.data.list[2].product_url,
                });
            } else {
                console.error(response);
            }
        }).catch(error => {
            console.error(error);
            if (error && error.response && error.response.data && error.response.data.hasOwnProperty('message')) {
                console.error(error.response.data.message);
            }
        });
    }

    clickBuy() {
        setTimeout(_ => {
            window.open(this.state.pUrl1);
            setTimeout(_ => {
                window.open(this.state.pUrl2);
                setTimeout(_ => {
                    window.open(this.state.pUrl3);
                }, 200);
            }, 200);
        }, 200);
    }

    redirectPage(page = global.config.landing_view) {
        this.props.history.push(`/${page}`);
    }

    render() {
        return (

            <div>

                <div style={{ height: '700px', width: '290px', backgroundColor: '#eee', marginTop: '120px', marginLeft: '50px', borderRadius: '12px', position: 'relative' }}>
                    <div className="block_wrap" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '50px', borderBottom: '1px solid #e4e4e4' }}>
                        <div style={{ position: 'absolute', cursor: 'pointer', top: '14px', left: '20px', width: '25px', height: '25px', backgroundImage: `url(/heart.png)`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                        <div className="block_content" style={{ textAlign: 'left', boxSixing: 'border-box', paddingLeft: '60px' }}><b style={{ fontSize: '22px', color: 'black' }}>my fit 1</b></div>
                        <div style={{ position: 'absolute', cursor: 'pointer', top: '12px', right: '40px', width: '25px', height: '25px', }}>
                            <b>$18.00</b>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: (600 * 0.33) + 'px', top: '50px', position: 'absolute', opacity: '0.85', backgroundImage: `url(${this.state.url1})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                    <div style={{ width: '100%', height: (600 * 0.33) + 'px', top: '248px', position: 'absolute', opacity: '0.85', backgroundImage: `url(${this.state.url2})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                    <div style={{ width: '100%', height: (600 * 0.33) + 'px', top: '446px', position: 'absolute', opacity: '0.85', backgroundImage: `url(${this.state.url3})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>

                    <div className="block_wrap" style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '50px', borderTop: '1px solid #e4e4e4', backgroundColor: '#FE9EB9', borderRadius: '0 0 12px 12px', cursor: 'pointer' }}>
                        <div className="block_content"><b style={{ fontSize: '22px', color: 'white' }} onClick={_ => { this.clickBuy(); }}>BUY</b></div>
                    </div>

                </div>

            </div >

        );
    }

}

export default withRouter(Fits);