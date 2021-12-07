
import '../common';
import axios from 'axios';
import React from 'react';
import { withRouter } from "react-router-dom";
import '../styles/Wardrobe.css';
import PropTypes from "prop-types";
import DeleteIcon from '@material-ui/icons/Delete';

class Wardrobe extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            name: 'N/A',
            price: '0.00',
            image_url: '',
            product_url: '',
            item_id: '',
            item_i: -1
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
            if (i == this.state.item_i) {
                this.deselectItem();
            } else {
                var item = this.state.items[i];
                this.setState({
                    name: item.name,
                    price: item.price,
                    image_url: item.image_path,
                    product_url: item.product_url,
                    item_id: item.id,
                    item_i: i
                });
            }
        }
    }

    deselectItem() {
        this.setState({
            item_id: '',
            image_url: '',
            product_url: '',
            price: '0.00',
            name: 'N/A',
            item_i: -1
        });
    }

    deleteCurrentItem() {
        if (this.state.item_id != '') {
            if (window.confirm(`Delete clothing item "${this.state.name}"?`)) {
                axios.post(`${global.config.api_url}/delete_clothing`, {
                    item: this.state.item_id
                }, {
                    headers: global.util.generate_auth_headers(global.api.get_token())
                }).then(response => {
                    if (response && response.data) {
                        this.deselectItem();
                        this.setupPage();
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
                <div style={{ textAlign: 'left', width: '50%', maxWidth: '700px', height: '700px', border: '2px solid #f4f4f4', borderRadius: '10px', float: 'left', padding: '10px 15px 10px 20px', boxSizing: 'border-box', overflow: 'scroll' }}>
                    {Object.keys(this.state.items).map((i) => {
                        // console.log(this.state.items[i]);
                        var item = this.state.items[i];
                        return (<div key={i.toString()} onClick={_ => { this.selectItem(i); }} style={{ height: '100px', width: '100px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', margin: '5px 10px 0 0', borderRadius: '5px', cursor: 'pointer', border: (this.state.item_i == i ? '3.7px solid #ffb8cc' : '1px solid #f1f1f1'), boxSizing: 'border-box' }}>
                        </div>);
                    })}
                </div>
                <div style={{ boxSizing: 'border-box', paddingLeft: '20px', width: '50%', maxWidth: '700px', height: '700px', float: 'left', fontSize: '20px', textAlign: 'left', position: 'relative' }}>
                    <div style={{ width: '100%', height: '570px', border: '2px solid #f4f4f4', borderRadius: '10px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundImage: `url(${this.state.image_url})`, transition: 'background-image 0.2s' }}></div>
                    <br />
                    <b>Item Name: </b><span id='name_output'>{this.state.name}</span><br />
                    <b>Item Price: </b><span id='price_output'>${this.state.price}</span><br />
                    <div className="micon" style={{ position: 'absolute', right: '200px', bottom: '52px', opacity: (this.state.item_id == '' ? '0.58' : '0.84'), pointerEvents: (this.state.item_id == '' ? 'none' : 'auto'), transition: 'opacity 0.2s ease' }}>
                        <DeleteIcon onClick={_ => { this.deleteCurrentItem(); }} fontSize='large'></DeleteIcon>
                    </div>
                    <div style={{ position: 'absolute', right: '5px', bottom: '35px', width: '170px', height: '70px' }}>
                        <button className="productPageButton" style={{ opacity: (this.state.item_id == '' ? '0.6' : '1'), pointerEvents: (this.state.item_id == '' ? 'none' : 'auto'), transition: 'opacity 0.2s ease' }} onClick={_ => { this.openProductPage(); }}>
                            <b>product page</b>
                        </button>
                    </div>
                </div>
            </div>

        );
    }

}

export default withRouter(Wardrobe);