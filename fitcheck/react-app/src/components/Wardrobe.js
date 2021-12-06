
import '../common';
import axios from 'axios';
import React from 'react';
import { withRouter } from "react-router-dom";
import '../styles/Wardrobe.css';
import PropTypes from "prop-types";

class Wardrobe extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            name: 'Example',
            price: '0.00',
            image_url: '',
            product_url: ''
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

    selectItem(i) {
        if (i < this.state.items.length) {
            var item = this.state.items[i];
            this.setState({
                name: item.name,
                price: item.price,
                image_url: item.image_path,
                product_url: item.product_url
            });
        }
    }

    setupPage() {
        axios.post(`${global.config.api_url}/get_clothing`, {
            token: `${global.api.get_token()}`,
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('list')) {
                console.log(response.data.list);
                this.setState({ items: response.data.list });
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

    openProductPage() {
        console.log(this.state.product_url);
        window.open(this.state.product_url);
    }

    redirectPage(page = global.config.landing_view) {
        this.props.history.push(`/${page}`);
    }

    render() {
        return (

            <div style={{ marginTop: '120px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1420px', width: '90%' }}>
                <div style={{ textAlign: 'left', width: '50%', maxWidth: '700px', height: '700px', border: '1px solid #e2e2e2', borderRadius: '10px', float: 'left' }}>
                    {Object.keys(this.state.items).map((i) => {
                        // console.log(this.state.items[i]);
                        var item = this.state.items[i];
                        return (<div key={i.toString()} onClick={_ => { this.selectItem(i); }} style={{ height: '100px', width: '100px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', margin: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                        </div>);
                    })}
                </div>
                <div style={{ boxSizing: 'border-box', paddingLeft: '20px', width: '50%', maxWidth: '700px', height: '700px', float: 'left', fontSize: '20px', textAlign: 'left', position: 'relative' }}>
                    <div style={{ width: '100%', height: '570px', border: '1px solid #e2e2e2', borderRadius: '10px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundImage: `url(${this.state.image_url})`, }}></div>
                    <br />
                    <b>Item Name: </b><span id='name_output'>{this.state.name}</span><br />
                    <b>Item Price: </b><span id='price_output'>${this.state.price}</span><br />
                    <div style={{ position: 'absolute', right: '5px', bottom: '35px', width: '170px', height: '70px' }}>
                        <button className="productPageButton" onClick={_ => { this.openProductPage(); }}>
                            <b>product page</b>
                        </button>
                    </div>
                </div>
            </div>

        );
    }

}

export default withRouter(Wardrobe);