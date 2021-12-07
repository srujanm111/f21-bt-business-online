
import '../common';
import axios from 'axios';
import React from 'react';
import { withRouter } from "react-router-dom";
import '../styles/Create.css';
import PropTypes from "prop-types";
import { Alert } from 'react-bootstrap';

class Create extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            outfitItems: [],
            lastAddedItem: null,
            priceTotal: 0
        };
        this.lastAddedItemRef = React.createRef()
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

    selectItem(i) {
        if (i < this.state.items.length) {
            var item = this.state.items[i];
            for (var j in this.state.outfitItems) {
                if (this.state.outfitItems[j].id == item.id)
                    return;
            }
            this.state.outfitItems.push(item);
            this.setState({
                outfitItems: this.state.outfitItems,
                lastAddedItem: item.id
            });
            setTimeout((_ => {
                this.scrollToLastAddedItem();
            }).bind(this), 100);
            this.updatePriceTotal();
        }
    }

    selectOutfitItem(j) {
        if (j < this.state.outfitItems.length) {
            var item = this.state.outfitItems[j];
            this.state.outfitItems.splice(j, 1);
            this.setState({
                outfitItems: this.state.outfitItems,
            });
            this.updatePriceTotal();
        }
    }

    updatePriceTotal() {
        var totalPrice = 0;
        for (var i in this.state.outfitItems) {
            totalPrice += this.state.outfitItems[i].price;
        }
        this.setState({
            priceTotal: totalPrice
        });
    }

    saveOutfit() {
        if (this.state.outfitItems.length > 0) {
            if (window.confirm(`Price: $${this.state.priceTotal.toFixed(2)}. Save outfit?`)) {
                var name = window.prompt("Outfit Name: ");
                // console.log(name);
                this.requestSaveOutfit(name, this.state.priceTotal, this.extractItemIds(this.state.outfitItems));
            }
        }
    }

    extractItemIds(items) {
        var extracted_ids = [];
        for (var i in items) {
            extracted_ids.push(items[i].id);
        }
        return extracted_ids;
    }

    requestSaveOutfit(name, price_total, items) {
        console.log(items);
        axios.post(`${global.config.api_url}/create_outfit`, {
            name: name,
            price_total: price_total,
            item_list: items
        }, {
            headers: global.util.generate_auth_headers(global.api.get_token())
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('id')) {
                console.log(response.data.id);
                window.alert(`Outfit "${name}" created!`);
                this.clearAll();
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

    clearAll() {
        this.setState({
            outfitItems: [],
            lastAddedItem: null,
            priceTotal: 0
        });
    }

    scrollToLastAddedItem() {
        this.lastAddedItemRef.current.scrollIntoView();
    }

    redirectPage(page = global.config.landing_view) {
        this.props.history.push(`/${page}`);
    }

    render() {
        return (

            <div style={{ marginTop: '120px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1420px', width: '90%' }}>
                <div style={{ boxSizing: 'border-box', paddingRight: '20px', width: '50%', maxWidth: '700px', height: '700px', float: 'left', fontSize: '20px', textAlign: 'left', position: 'relative' }}>
                    <div style={{ width: '100%', height: '590px', border: '2px solid #f4f4f4', borderRadius: '10px', padding: '7px 15px 10px 20px', boxSizing: 'border-box', overflow: 'scroll', position: 'relative', textAlign: 'center' }}>
                        {Object.keys(this.state.outfitItems).map((j) => {
                            // console.log(this.state.items[i]);
                            var item = this.state.outfitItems[j];
                            return (<div ref={this.state.lastAddedItem == item.id ? this.lastAddedItemRef : null} key={j.toString()} onClick={_ => { this.selectOutfitItem(j); }} style={{ height: '220px', width: '220px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', margin: '10px 10px 0 0', borderRadius: '5px', cursor: 'pointer', border: '1px solid #f1f1f1' }}>
                            </div>);
                        })}
                    </div>
                    <div className="block_wrap" style={{ position: 'absolute', bottom: '110px', right: '20px', width: '120px', height: '50px', backgroundColor: 'white', borderTop: '2px solid #f4f4f4', borderLeft: '2px solid #f4f4f4', borderRight: 'none', borderBottom: 'none', borderRadius: '7px 0 0 0' }}>
                        <div className="block_content">
                            <span style={{ opacity: (this.state.outfitItems.length < 1 ? '0.85' : '0.96') }}>
                                <b>${this.state.priceTotal.toFixed(2)}</b>
                            </span>
                        </div>
                    </div>
                    <br />
                    <div className="block_wrap" style={{ position: 'absolute', left: '0', bottom: '5px', width: '100%', height: '95px', paddingRight: '24px', boxSizing: 'border-box' }}>
                        <div className="block_content" style={{ margin: '0 auto', width: '350px', marginRight: '15px' }}>
                            <div style={{ width: '170px', height: '70px', display: 'inline-block' }}>
                                <button className="saveOutfitButton" onClick={_ => { this.saveOutfit(); }}>
                                    <b>save outfit</b>
                                </button>
                            </div>
                            <div style={{ width: '170px', height: '70px', display: 'inline-block', marginLeft: '15px' }}>
                                <button className="clearAllButton" onClick={_ => { this.clearAll(); }}>
                                    <b>clear all</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'left', width: '50%', maxWidth: '700px', height: '700px', border: '2px solid #f4f4f4', borderRadius: '10px', float: 'left', padding: '10px 15px 10px 20px', boxSizing: 'border-box', overflow: 'scroll' }}>
                    {Object.keys(this.state.items).map((i) => {
                        // console.log(this.state.items[i]);
                        var item = this.state.items[i];
                        return (<div key={i.toString()} onClick={_ => { this.selectItem(i); }} style={{ height: '100px', width: '100px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', margin: '5px 10px 0 0', borderRadius: '5px', cursor: 'pointer', border: '1px solid #f1f1f1' }}>
                        </div>);
                    })}
                </div>
            </div>

        );
    }

}

export default withRouter(Create);