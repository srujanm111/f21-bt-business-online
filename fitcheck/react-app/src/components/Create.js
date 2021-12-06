
import '../common';
import axios from 'axios';
import React from 'react';
import { withRouter } from "react-router-dom";
import '../styles/Create.css';
import PropTypes from "prop-types";

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
            this.state.outfitItems.push(item);
            this.setState({
                outfitItems: this.state.outfitItems,
            });
        }
    }

    selectOutfitItem(i) {
        if (i < this.state.outfitItems.length) {
            var item = this.state.outfitItems[i];
            this.state.outfitItems.splice(i, 1);
            this.setState({
                outfitItems: this.state.outfitItems,
            });
        }
    }

    saveOutfit() {
        if (this.state.outfitItems.length > 0) {
            var totalPrice = 0;
            for (var i in this.state.outfitItems) {
                totalPrice += this.state.outfitItems[i].price;
            }
            if (window.confirm(`Price: $${totalPrice.toFixed(2)}. Save Outfit?`)) {
                var name = window.prompt("New Outfit Name: ");
                console.log(name);
            }
        }
    }

    clearAll() {
        this.setState({
            outfitItems: []
        });
    }

    redirectPage(page = global.config.landing_view) {
        this.props.history.push(`/${page}`);
    }

    render() {
        return (

            <div style={{ marginTop: '120px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1420px', width: '90%' }}>
                <div style={{ boxSizing: 'border-box', paddingRight: '20px', width: '50%', maxWidth: '700px', height: '700px', float: 'left', fontSize: '20px', textAlign: 'left', position: 'relative' }}>
                    <div style={{ width: '100%', height: '590px', border: '1px solid #e2e2e2', borderRadius: '10px', }}>
                        {Object.keys(this.state.outfitItems).map((i) => {
                            // console.log(this.state.items[i]);
                            var item = this.state.outfitItems[i];
                            return (<div key={i.toString()} onClick={_ => { this.selectOutfitItem(i); }} style={{ height: '220px', width: '220px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', margin: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                            </div>);
                        })}
                    </div>
                    <br />
                    <div style={{ position: 'absolute', left: '15px', bottom: '20px', width: '170px', height: '70px' }}>
                        <button className="saveOutfitButton" onClick={_ => { this.saveOutfit(); }}>
                            <b>save outfit</b>
                        </button>
                    </div>
                    <div style={{ position: 'absolute', right: '40px', bottom: '20px', width: '170px', height: '70px' }}>
                        <button className="clearAllButton" onClick={_ => { this.clearAll(); }}>
                            <b>clear all</b>
                        </button>
                    </div>
                </div>
                <div style={{ textAlign: 'left', width: '50%', maxWidth: '700px', height: '700px', border: '1px solid #e2e2e2', borderRadius: '10px', float: 'left' }}>
                    {Object.keys(this.state.items).map((i) => {
                        // console.log(this.state.items[i]);
                        var item = this.state.items[i];
                        return (<div key={i.toString()} onClick={_ => { this.selectItem(i); }} style={{ height: '100px', width: '100px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', margin: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                        </div>);
                    })}
                </div>
            </div>

        );
    }

}

export default withRouter(Create);