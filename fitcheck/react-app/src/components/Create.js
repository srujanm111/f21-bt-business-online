
import '../common';
import axios from 'axios';
import React from 'react';
import { withRouter } from "react-router-dom";
import '../styles/Create.css';
import PropTypes from "prop-types";
import { Alert } from 'react-bootstrap';
import queryString from 'query-string';

import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import Edit from '@material-ui/icons/Edit';

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
            outfitItemsCache: [],
            lastAddedItem: null,
            priceTotal: 0,
            editingOutfitId: null,
            editingOutfitName: "",
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
        var newEditingOutfitId = null;
        let params = queryString.parse(this.props.location.search);
        if (params['edit'] && (`${params['edit']}`).trim().length == 24) {
            newEditingOutfitId = (`${params['edit']}`).trim();
        }
        axios.post(`${global.config.api_url}/get_clothing`, {
            token: `${global.api.get_token()}`,
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('list')) {
                console.log(response.data.list);
                this.setState({ items: response.data.list.sort(this.itemSort) });
                if (newEditingOutfitId) {
                    axios.post(`${global.config.api_url}/get_outfit`, {
                        outfit_id: `${newEditingOutfitId}`,
                    }, {
                        headers: global.util.generate_auth_headers(global.api.get_token())
                    }).then(response2 => {
                        if (response2 && response2.data && response2.data.hasOwnProperty('outfit')) {
                            console.log(response2.data.outfit);
                            this.state.outfitItems = [];
                            for (var c in response2.data.outfit.clothes) {
                                var clothing_item = this.getItemById(response2.data.outfit.clothes[c]);
                                // console.log(clothing_item);
                                if (clothing_item != null)
                                    this.state.outfitItems.push(clothing_item);
                            }
                            this.setState({
                                editingOutfitName: response2.data.outfit.name,
                                editingOutfitId: newEditingOutfitId,
                                outfitItems: this.state.outfitItems,
                                outfitItemsCache: JSON.parse(JSON.stringify(this.state.outfitItems))
                            });
                            this.updatePriceTotal();
                        } else {
                            console.error(response2);
                        }
                    }).catch(error => {
                        console.error(error);
                        if (error && error.response && error.response.data && error.response.data.hasOwnProperty('message')) {
                            console.error(error.response.data.message);
                        }
                    });
                }
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

    getItemById(id) {
        for (var i in this.state.items) {
            if (this.state.items[i].id == id)
                return this.state.items[i];
        }
        return null;
    }

    itemSort(a, b) {
        return b.ts_updated - a.ts_updated;
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
            var name = this.state.editingOutfitName ? this.state.editingOutfitName : null;
            if (window.confirm(`${this.state.editingOutfitId == null ? "Save" : "Update"} fit${this.state.editingOutfitId == null ? "" : " \"" + this.state.editingOutfitName + "\""} with total price $${this.state.priceTotal.toFixed(2)}?`)) {
                if (name == null) name = window.prompt("Fit Name: ");
                // console.log(name);
                if (name != null && name.trim() != '')
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
        var action = this.state.editingOutfitId == null ? 'create' : 'update';
        var req_body = {
            name: name,
            price_total: price_total,
            item_list: items
        };
        if (this.state.editingOutfitId != null && this.state.editingOutfitId.trim().length == 24) {
            req_body['outfit_id'] = this.state.editingOutfitId;
        }
        axios.post(`${global.config.api_url}/${action}_outfit`, req_body, {
            headers: global.util.generate_auth_headers(global.api.get_token())
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('id')) {
                console.log(response.data.id);
                this.setState({
                    outfitItemsCache: JSON.parse(JSON.stringify(this.state.outfitItems))
                });
                window.alert(`Fit "${name}" ${action}d!`);
                if (action == "create") {
                    // this.clearAll();
                    setTimeout(_ => {
                        window.location = (`/create/?edit=${response.data.id.toString()}`);
                    }, 50);
                }
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
        if (this.state.outfitItems.length > 0 && window.confirm(`Abandon${(this.state.editingOutfitId == null ? ' new fit' : ' changes to fit "' + this.state.editingOutfitName + '"')}?`)) {
            if (this.state.editingOutfitId != null) {
                console.log(this.state.outfitItemsCache);
                this.state.outfitItems = JSON.parse(JSON.stringify(this.state.outfitItemsCache));
                this.setState({
                    outfitItems: this.state.outfitItems,
                    lastAddedItem: null,
                });
                this.updatePriceTotal();
            } else {
                this.setState({
                    outfitItems: [],
                    lastAddedItem: null,
                    priceTotal: 0
                });
            }
            // if (this.state.editingOutfitId != null && window.confirm("Exit without saving?")) {
            //     window.location = ('/create');
            // }
        }
    }

    closeOutfit() {
        if (this.state.editingOutfitId != null && window.confirm(`Abandon changes and close fit "${this.state.editingOutfitName}"?`)) {
            window.location = '/create';
        }
    }

    renameOutfit() {
        if (this.state.editingOutfitId != null) {
            var new_name = window.prompt(`Rename fit "${this.state.editingOutfitName}" to: `);
            if (new_name == null || new_name.trim() == '') return;
            axios.post(`${global.config.api_url}/rename_outfit`, {
                outfit_id: this.state.editingOutfitId,
                new_name: new_name
            }, {
                headers: global.util.generate_auth_headers(global.api.get_token())
            }).then(response => {
                if (response && response.data && response.data.hasOwnProperty('id') && response.data.id == this.state.editingOutfitId) {
                    console.log(response.data.id);
                    // var old_name = this.state.editingOutfitName;
                    // window.alert(`Fit "${old_name}" renamed to "${response.data.new_name}"!`);
                    this.setState({
                        editingOutfitName: response.data.new_name
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
                    <div className={'block_wrap' + ' closeButton ' + (this.state.editingOutfitId == null ? 'closeButtonState1' : 'closeButtonState2')} style={{ width: '50px', height: '48px', position: 'absolute', left: '0', top: '0', cursor: 'pointer' }}>
                        <div className="block_content">
                            <CloseIcon onClick={_ => { this.closeOutfit(); }} style={{ transform: 'scale(0.85)' }} fontSize="large"></CloseIcon>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '590px', border: '2px solid #f4f4f4', borderRadius: '10px', padding: '7px 15px 10px 20px', boxSizing: 'border-box', overflow: 'scroll', position: 'relative', textAlign: 'center' }}>
                        {Object.keys(this.state.outfitItems).map((j) => {
                            // console.log(this.state.items[i]);
                            var item = this.state.outfitItems[j];
                            return (<div ref={this.state.lastAddedItem == item.id ? this.lastAddedItemRef : null} key={j.toString()} onClick={_ => { this.selectOutfitItem(j); }} className="outfit_editor_outfit_item" style={{ height: '220px', width: '220px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', margin: '10px 10px 0 0', borderRadius: '5px', cursor: 'pointer', border: '1px solid #fbfbfb' }}>
                            </div>);
                        })}
                    </div>
                    <div className="block_wrap" style={{ position: 'absolute', top: '0', right: '20px', width: 'auto', height: '50px', backgroundColor: 'white', borderBottom: '2px solid #f4f4f4', borderLeft: '2px solid #f4f4f4', borderTop: 'none', borderRight: 'none', borderRadius: '0 0 0 7px', display: (this.state.editingOutfitId == null ? 'none' : 'table') }}>
                        <div className="block_content">
                            <span onClick={_ => { this.renameOutfit(); }} className="editFitNameIcon" style={{ padding: '0 0 0 10px', height: 'auto', position: 'absolute', top: '8px', right: '9.5px', display: (this.state.editingOutfitId == null ? 'none' : 'inline-block'), zIndex: '31' }}>
                                <EditIcon style={{ transform: 'scale(0.85)' }} fontSize='small'></EditIcon>
                            </span>
                            <span style={{ opacity: (this.state.outfitItems.length < 1 ? '0.82' : '0.96'), padding: `0 ${this.state.editingOutfitId == null ? '20px' : '40px'} 0 20px`, }}>
                                <b>{this.state.editingOutfitId == null ? "untitled" : this.state.editingOutfitName}</b>
                            </span>
                        </div>
                    </div>
                    <div className="block_wrap" style={{ position: 'absolute', bottom: '110px', right: '20px', width: '120px', height: '50px', backgroundColor: 'white', borderTop: '2px solid #f4f4f4', borderLeft: '2px solid #f4f4f4', borderRight: 'none', borderBottom: 'none', borderRadius: '7px 0 0 0' }}>
                        <div className="block_content">
                            <span style={{ opacity: (this.state.outfitItems.length < 1 ? '0.82' : '0.96') }}>
                                <b>${this.state.priceTotal.toFixed(2)}</b>
                            </span>
                        </div>
                    </div>
                    <br />
                    <div className="block_wrap" style={{ position: 'absolute', left: '0', bottom: '5px', width: '100%', height: '95px', paddingRight: '24px', boxSizing: 'border-box' }}>
                        <div className="block_content" style={{ margin: '0 auto', width: '350px', marginRight: '15px' }}>
                            <div style={{ width: '170px', height: '70px', display: 'inline-block', marginRight: '8px' }}>
                                <button className="clearAllButton" onClick={_ => { this.clearAll(); }}>
                                    <b>clear{window.innerWidth > 875 ? ' fit' : ''}</b>
                                </button>
                            </div>
                            <div style={{ width: '170px', height: '70px', display: 'inline-block', marginLeft: '8px' }}>
                                <button className="saveOutfitButton" onClick={_ => { this.saveOutfit(); }}>
                                    <b>{this.state.editingOutfitId == null ? "save" : "update"}{window.innerWidth > 875 ? ' fit' : ''}</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
                <div style={{ textAlign: 'left', width: '50%', maxWidth: '700px', height: '700px', border: '2px solid #f4f4f4', borderRadius: '10px', float: 'left', padding: '10px 15px 10px 20px', boxSizing: 'border-box', overflow: 'scroll' }}>
                    {Object.keys(this.state.items).map((i) => {
                        // console.log(this.state.items[i]);
                        var item = this.state.items[i];
                        return (<div key={i.toString()} onClick={_ => { this.selectItem(i); }} className="outfit_editor_wardrobe_item" style={{ height: '100px', width: '100px', backgroundImage: `url(${item.image_path})`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', margin: '5px 10px 0 0', borderRadius: '5px', cursor: 'pointer', border: '1px solid #fbfbfb' }}>
                        </div>);
                    })}
                </div>
            </div >

        );
    }

}

export default withRouter(Create);