/* FITCHECK
 * WEB FRONTEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// Wardrobe page view

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
            price: 0,
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

    itemSort(a, b) {
        return b.ts_updated - a.ts_updated;
    }

    setupPage() {
        axios.post(`${global.config.api_url}/get_clothing`, {
            token: `${global.api.get_token()}`,
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('list')) {
                // console.log('list', response.data.list);
                // console.log('sorted', response.data.list.sort(this.itemSort));
                this.setState({ items: response.data.list.sort(this.itemSort) });
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
                        return (<div key={i.toString()} onClick={_ => { this.selectItem(i); }} className="wardrobe_clothing_item" style={{ height: '100px', width: '100px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', margin: '5px 10px 0 0', borderRadius: '5px', cursor: 'pointer', border: (this.state.item_i == i ? '4px solid rgba(215, 245, 158, 0.95)' /* #E4FFB1 #ffb8cc */ : '1px solid #fbfbfb'), boxSizing: 'border-box' }}>
                        </div>);
                    })}
                </div>
                <div style={{ boxSizing: 'border-box', paddingLeft: '20px', width: '50%', maxWidth: '700px', height: '700px', float: 'left', fontSize: '20px', textAlign: 'left', position: 'relative' }}>


                    <div className="block_wrap" style={{ position: 'absolute', top: '0', left: '20px', width: 'auto', height: '50px', backgroundColor: 'white', borderBottom: '2px solid #f4f4f4', borderRight: '2px solid #f4f4f4', borderTop: 'none', borderLeft: 'none', borderRadius: '0 0 7px 0', display: (this.state.item_i == -1 ? 'none' : 'table') }}>
                        <div className="block_content">
                            <span style={{ opacity: '0.96', padding: `0 20px 0 20px`, }}>
                                <b style={{ fontSize: (this.state.name.length > 25 ? '18px' : '21px') }}>{this.state.name}</b>
                            </span>
                        </div>
                    </div>

                    <div className="block_wrap" style={{ position: 'absolute', bottom: '130px', left: '20px', width: '120px', height: '50px', backgroundColor: 'white', borderTop: '2px solid #f4f4f4', borderRight: '2px solid #f4f4f4', borderLeft: 'none', borderBottom: 'none', borderRadius: '0 7px 0 0' }}>
                        <div className="block_content">
                            <span style={{ opacity: (this.state.item_id == '' ? '0.85' : '0.96') }}>
                                <b>${this.state.price.toFixed ? this.state.price.toFixed(2) : "0.00"}</b>
                            </span>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '570px', border: '2px solid #f4f4f4', borderRadius: '10px', }}>
                        <div className="block_wrap" style={{ width: '100%', height: '100%%', margin: '0 auto' }}>
                            <div className="block_content">
                                <div style={{ margin: '0 auto', height: '80%', width: '90%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundImage: `url(${this.state.image_url})`, transition: 'background-image 0.35s' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ opacity: (this.state.item_id == '' ? '0.8' : '0'), height: '120px' }} className="block_wrap">
                        <div style={{ textAlign: 'left' }} className="block_content">
                            <b><span>&nbsp;Great finds!</span></b>
                        </div>
                    </div>
                    <div className="micon" style={{ position: 'absolute', right: '200px', bottom: '52px', pointerEvents: (this.state.item_id == '' ? 'none' : 'auto'), transition: 'opacity 0.2s ease' }}>
                        <DeleteIcon style={{ opacity: (this.state.item_id == '' ? '0.58' : '0.84') }} onClick={_ => { this.deleteCurrentItem(); }} fontSize='large'></DeleteIcon>
                    </div>
                    <div style={{ position: 'absolute', right: '5px', bottom: '35px', width: '170px', height: '70px' }}>
                        <button className={"productPageButton" + ' ' + (this.state.item_id == '' ? 'productPageButtonState1' : 'productPageButtonState2')} style={{ opacity: (this.state.item_id == '' ? '0.6' : '1'), pointerEvents: (this.state.item_id == '' ? 'none' : 'auto') }} onClick={_ => { this.openProductPage(); }}>
                            <b>product page</b>
                        </button>
                    </div>
                </div>
            </div>

        );
    }

}

export default withRouter(Wardrobe);