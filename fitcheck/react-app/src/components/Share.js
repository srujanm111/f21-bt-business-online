
import '../common';
import React from 'react';
import ReactDOM from "react-dom";

import axios from 'axios';

import { NavLink, withRouter } from "react-router-dom";
import bottomNav from '../assets/bottomNav.svg';
import outfit1 from '../assets/outfit1.svg';
import outfit2 from '../assets/outfit2.svg';
import outfit3 from '../assets/outfit3.svg';
import outfit4 from '../assets/outfit4.svg';
import '../styles/Fits.css';
import PropTypes from "prop-types";
import queryString from 'query-string';
import logo_asset from '../assets/logo.svg';

import QRCode from "react-qr-code";

import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';

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
            wardrobeItems: [],
            outfitList: [],
            outfitHeight: 601,
            menuShowing: null,
            authenticated: false
        };
    }

    componentDidMount() {
        global.api.authenticate((result => {
            // if (!result.success) this.redirectPage();
            // if (!result.success)
            this.setState({
                authenticated: result.success
            });
            this.setupPage();
            // else this.setupAuthPage();
        }).bind(this));
    }
    componentWillUnmount() {

    }

    setupPage() {
        var sharedOutfitId = null;
        let params = queryString.parse(this.props.location.search);
        if (params['fit'] && (`${params['fit']}`).trim().length == 24) {
            sharedOutfitId = (`${params['fit']}`).trim();
        }
        axios.post(`${global.config.api_url}/get_shared_outfit`, {
            outfit_id: sharedOutfitId
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('outfit')) {
                console.log(response.data.outfit);
                this.setState({ wardrobeItems: response.data.outfit.clothes_detail, outfitList: [response.data.outfit] });
                // delete response.data.outfit['clothes_detail'];
                this.setState({});
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

    setupAuthPage() {
        axios.post(`${global.config.api_url}/get_clothing`, {
            token: `${global.api.get_token()}`,
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('list')) {
                console.log(response.data.list);
                this.setState({ wardrobeItems: response.data.list.sort(this.itemSort) });
                axios.post(`${global.config.api_url}/get_outfits`, {
                    include_clothes: true,
                }, {
                    headers: global.util.generate_auth_headers(global.api.get_token())
                }).then(response2 => {
                    if (response2 && response2.data && response2.data.hasOwnProperty('list')) {
                        console.log(response2.data.list);
                        this.setState({ outfitList: response2.data.list.sort(this.outfitSort) });
                    } else {
                        console.error(response2);
                    }
                }).catch(error => {
                    console.error(error);
                    if (error && error.response && error.response.data && error.response.data.hasOwnProperty('message')) {
                        console.error(error.response.data.message);
                    }
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

    clickBuy(outfit_id) {
        var outfit_obj = null;
        // console.log(outfit_id);
        for (var o_l in this.state.outfitList) {
            if (this.state.outfitList[o_l].id == outfit_id) {
                outfit_obj = this.state.outfitList[o_l];
                break;
            }
        }
        if (outfit_obj == null) return;
        for (var i_l in outfit_obj.clothes) {
            outfit_obj.clothes[i_l] = this.getItemById(outfit_obj.clothes[i_l]);
        }
        var timerCounter = 100;
        for (var i_l in outfit_obj.clothes) {
            setTimeout((item => {
                return _ => {
                    window.open(item.product_url);
                    // console.log(item);
                };
            })(outfit_obj.clothes[i_l]), timerCounter);
            timerCounter += 100;
        }
    }

    redirectPage(page = global.config.landing_view) {
        this.props.history.push(`/${page}`);
    }

    getItemById(id) {
        for (var i in this.state.wardrobeItems) {
            if (this.state.wardrobeItems[i].id == id) {
                return this.state.wardrobeItems[i];
            }
        }
        return null;
    }

    showMenu(id) {
        if (this.state.menuShowing == id) {
            this.setState({
                menuShowing: null
            });
        } else
            this.setState({
                menuShowing: id
            });
    }

    editOutfit(id) {
        console.log(`editing outfit ${id}`);
        window.location = (`/create/?edit=${id}`);
    }

    getOutfitIndexById(id) {
        for (var o_l in this.state.outfitList) {
            if (this.state.outfitList[o_l].id == id)
                return o_l;
        }
        return null;
    }

    toggleStarOutfit(id, starred) {
        if (this.state.authenticated) {
            starred = !starred;
            axios.post(`${global.config.api_url}/star_outfit`, {
                outfit: id.toString(),
                starred: starred
            }, {
                headers: global.util.generate_auth_headers(global.api.get_token())
            }).then(response => {
                if (response && response.data) {
                    console.log(response.data);
                    var index_to_update = this.getOutfitIndexById(id);
                    if (index_to_update !== null) {
                        this.state.outfitList[index_to_update].starred = starred;
                        this.setState({
                            outfitList: this.state.outfitList
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
    }

    itemSort(a, b) {
        return b.ts_updated - a.ts_updated;
    }

    outfitSort(a, b) {
        if (a.starred === b.starred) {
            return b.ts_updated - a.ts_updated;
        } else {
            if (a.starred)
                return -1;
            else return 1;
        }
    }

    deleteOutfit(id, name) {
        if (window.confirm(`Permanently DELETE masterpiece "${name}"?`)) {
            axios.post(`${global.config.api_url}/delete_outfit`, {
                outfit: id.toString(),
            }, {
                headers: global.util.generate_auth_headers(global.api.get_token())
            }).then(response => {
                if (response && response.data) {
                    console.log(response.data);
                    // this.setState({ outfitList: response.data.list });
                    var index_to_remove = this.getOutfitIndexById(id);
                    if (index_to_remove !== null) {
                        this.state.outfitList.splice(index_to_remove, 1);
                        this.setState({
                            outfitList: this.state.outfitList
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
    }

    shortenText(name) {
        var text_lim = ("lorem ipsum d").length;
        if (name.length > text_lim)
            name = name.substring(0, text_lim - 1).trim() + '...';
        return name;
    }

    closeButton() {
        if (this.state.authenticated) {
            this.redirectPage('fits');
        } else {
            this.redirectPage();
        }
    }

    render() {
        return (
            <div style={{ textAlign: 'left', paddingBottom: '60px', paddingTop: '95px', marginLeft: '30px' }}>
                <div id="logo_wrap" style={{ position: 'absolute', top: '10px', left: '15px' }}>
                    <NavLink to='/'>
                        <img className="logo" src={logo_asset} alt='logo' />
                    </NavLink>
                </div>
                <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: '1', curosr: 'pointer', height: '50px', width: '50px', zIndex: '100' }}>
                    <CloseIcon onClick={_ => { this.closeButton(); }} className="shareCloseButton" style={{ cursor: 'pointer', opacity: '0.9' }}></CloseIcon>
                </div>
                {Object.keys(this.state.outfitList).map(((o_l) => {
                    // console.log(this.state.items[i]);
                    var outfit = this.state.outfitList[o_l];
                    return (
                        <div key={o_l.toString()} style={{ height: '700px', width: '420px', backgroundColor: '#eee', marginTop: '30px', marginBottom: '10px', marginLeft: '50px', borderRadius: '12px', position: 'relative', boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.07)", display: 'inline-block', float: 'left' }}>
                            <div style={{ position: 'absolute', top: '-3.5px', right: '-6px', width: '28px', height: '28px', zIndex: '20', display: (this.state.authenticated ? 'block' : 'none') }}>
                                <div className={"fitsMoreButton block_wrap " + (this.state.menuShowing == outfit.id ? 'fitsMoreButtonState2' : 'fitsMoreButtonState1')} style={{ width: '100%', height: '100%', backgroundColor: '#fe9eb9' /* #f4f4f4 */, cursor: 'pointer' }} onClick={_ => { this.showMenu(outfit.id); }}>
                                    <div className="block_content" style={{ opacity: '1' }}>
                                        <MoreVertIcon fontSize="small" style={{ cursor: 'pointer', fill: 'white' }}></MoreVertIcon>
                                    </div>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', top: '25px', right: '-6px', width: '28px', height: '64px', zIndex: '20', display: 'block', display: (this.state.authenticated ? 'block' : 'none') /* (this.state.menuShowing == outfit.id ? 'block' : 'none') */ }}>
                                <div className={"fitsEditButton block_wrap " + (this.state.menuShowing == outfit.id ? 'fitsEditButtonState2' : 'fitsEditButtonState1')} onClick={_ => { this.editOutfit(outfit.id); }} style={{ width: '100%', height: '50%', backgroundColor: '#fe9eb9' /* #f4f4f4 */, borderRadius: '0', cursor: 'pointer', position: 'absolute', top: '0', right: '0' }}>
                                    <div className="block_content" style={{ opacity: '1' }}>
                                        <EditIcon fontSize="small" style={{ cursor: 'pointer', fill: 'white' }}></EditIcon>
                                    </div>
                                </div>
                                <div className={"fitsDeleteButton block_wrap " + (this.state.menuShowing == outfit.id ? 'fitsDeleteButtonState2' : 'fitsDeleteButtonState1')} onClick={_ => { this.deleteOutfit(outfit.id, outfit.name); }} style={{ width: '100%', height: '50%', backgroundColor: '#fe9eb9' /* #f4f4f4 */, borderRadius: '0 0 28% 28%', cursor: 'pointer', position: 'absolute', top: '28px', right: '0' }}>
                                    <div className="block_content" style={{ opacity: '1' }}>
                                        <DeleteIcon fontSize="small" style={{ cursor: 'pointer', fill: 'white' }}></DeleteIcon>
                                    </div>
                                </div>
                            </div>
                            <div className="block_wrap" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '50px', borderBottom: '1px solid #e4e4e4', }}>
                                <div onClick={_ => { this.toggleStarOutfit(outfit.id, outfit.starred); }} style={{ position: 'absolute', cursor: 'pointer', top: '16px', left: '20px', width: '20px', height: '20px', backgroundImage: `url(/${(!outfit.starred ? 'heart_clear' : 'heart')}.png)`, display: 'inline-block', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity: '0.9', cursor: 'pointer' }}></div>
                                <div className="block_content" style={{ textAlign: 'left', boxSixing: 'border-box', paddingLeft: '58px' }}><b style={{ fontSize: '17.5px', color: 'black' }}>{this.shortenText(outfit.name)}&nbsp;&nbsp;<span style={{ fontSize: '12px', fontWeight: '400' }}>by</span>&nbsp;<span style={{ fontSize: '14px', fontWeight: '500' }}>@{outfit.creator}</span></b></div>
                                <div style={{ position: 'absolute', top: '9px', right: '77px', width: '25px', height: '25px', color: '#111' }}>
                                    <b style={{ fontSize: '19px' }}>${outfit.price_total.toFixed(2)}</b>
                                </div>
                                {/* <div style={{ opacity: '0.8', position: 'absolute', top: '13px', left: '12px', width: '25px', height: '25px', color: '#111' }}></div> */}
                            </div>
                            <div style={{ height: (this.state.outfitHeight + 'px'), position: 'absolute', top: '50px', left: '0', width: '100%' }}>
                                {Object.keys(outfit.clothes).map((c) => {
                                    var item_id = outfit.clothes[c];
                                    var item = this.getItemById(item_id);
                                    // console.log(item_id);
                                    // console.log(item);
                                    // console.log(this.state.wardrobeItems);
                                    return (
                                        <div key={c.toString()} style={{ cursor: 'pointer', width: '100%', height: ((this.state.outfitHeight) / outfit.clothes.length) + 'px', position: 'relative' }}>
                                            <div className="outfitItemImage" style={{ backgroundImage: `url(${item.image_path})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1' }}></div>
                                            <div className="outfitItemDetail" style={{ height: '100%', width: '100%', boxSizing: 'border-box', padding: '10px 20px', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '2' }}>
                                                <div style={{ position: 'absolute', top: '10px', left: '0', width: '100%', minHeight: '20px', height: 'auto', boxSizing: 'border-box', paddingLeft: '20px' }}>
                                                    <span style={{ fontWeight: '800', fontSize: (item.name.length > 25 && outfit.clothes.length ? '17px' : '20px'), paddingRight: '10px' }}>{item.name}</span>
                                                </div>
                                                <div style={{ position: 'absolute', bottom: '10px', left: '0', width: '100%', minHeight: '20px', height: 'auto', boxSizing: 'border-box', paddingLeft: '20px' }}>
                                                    <span style={{ fontWeight: '800', fontSize: '25px' }}>${item.price.toFixed(2)}</span><br />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="block_wrap outfitBuyButton" style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '50px', borderRadius: '0 0 12px 12px', cursor: 'pointer' }} onClick={_ => { this.clickBuy(outfit.id); }}>
                                <div className="block_content"><b style={{ fontSize: '22px', color: 'white' }}>BUY</b></div>
                            </div>
                        </div>
                    );
                }).bind(this))
                }
                <div style={{ position: 'absolute', top: '0', right: '0', height: '100%', width: '50%' }}>
                    <div className="block_wrap">
                        <div className="block_content">
                            <QRCode value={`${window.location.protocol}//${window.location.host}/share?fit=${this.state.outfitList.length > 0 ? (this.state.outfitList[0].id) : ''}`}></QRCode>
                        </div>
                    </div>
                </div>
            </div >

        );
    }

}

export default withRouter(Fits);