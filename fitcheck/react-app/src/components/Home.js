/* FITCHECK
 * WEB FRONTEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// Home (returning user) page view

import '../common';
import axios from 'axios';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';

import createBox from '../assets/createBox.svg';
import recentBox from '../assets/recentBox.svg';
import inspiredBox from '../assets/inspiredBox.svg';
import bottomNav from '../assets/bottomNav.svg';
import login from '../assets/login.svg';
import signup from '../assets/signup.svg';

class Home extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            wardrobeItems: [],
            outfitList: [],
            image_preview: ['', '', ''],
            inspiration_message_first: "Check out those fits!",
            inspiration_message_second: "Take it home!"
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

    redirectPage(page = global.config.landing_view) {
        this.props.history.push(`/${page}`);
    }

    createNewFitButton() {
        console.log('create new fit');
    }

    mostRecentFitButton() {
        console.log('most recent fit');
    }

    getInspired() {
        console.log('get inspired');
    }

    openOutfit(outfit_num) {
        console.log(`open outfit ${outfit_num}`);
    }

    itemSort(a, b) {
        return b.ts_updated - a.ts_updated;
    }

    outfitSort(a, b) {
        // if (a.starred === b.starred) {
        return b.ts_updated - a.ts_updated;
        // } else {
        //     if (a.starred)
        //         return -1;
        //     else return 1;
        // }
    }

    getItemById(id) {
        for (var i in this.state.wardrobeItems) {
            if (this.state.wardrobeItems[i].id == id) {
                return this.state.wardrobeItems[i];
            }
        }
        return null;
    }

    getItemsByIds(ids) {
        var output_list = [];
        for (var j in ids) {
            for (var i in this.state.wardrobeItems) {
                if (this.state.wardrobeItems[i].id == ids[j]) {
                    output_list.push(this.state.wardrobeItems[i]);
                }
            }
        }
        return output_list;
    }

    setupPage() {
        axios.post(`${global.config.api_url}/get_clothing`, {
            token: `${global.api.get_token()}`,
        }).then(response => {
            if (response && response.data && response.data.hasOwnProperty('list')) {
                // console.log(response.data.list);
                this.setState({ wardrobeItems: response.data.list.sort(this.itemSort) });
                axios.post(`${global.config.api_url}/get_outfits`, {
                    include_clothes: true,
                }, {
                    headers: global.util.generate_auth_headers(global.api.get_token())
                }).then(response2 => {
                    if (response2 && response2.data && response2.data.hasOwnProperty('list')) {
                        // console.log(response2.data.list);
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

        axios.post(`${global.config.api_url}/get_img_previews`, {
            token: `${global.api.get_token()}`,
        }, {
            headers: global.util.generate_auth_headers(global.api.get_token())
        }).then(response3 => {
            if (response3 && response3.data && response3.data.hasOwnProperty('previews')) {
                // console.log(response3.data.previews);
                this.setState({ image_preview: response3.data.previews });
            } else {
                console.error(response3);
            }
        }).catch(error => {
            console.error(error);
            if (error && error.response && error.response.data && error.response.data.hasOwnProperty('message')) {
                console.error(error.response.data.message);
            }
        });
    }

    render() {
        return (
            <div style={{ marginTop: '135px', textAlign: 'left' }}>
                <div style={{ width: '90%', margin: '0 auto' }}>
                    <h1 className="homepage_inspiration_message">{this.state.inspiration_message_first}</h1>
                </div>
                <div className="homepage_box_wrapper">
                    <div className="homepage_box">
                        <button className="homepage_box_content" onClick={_ => { this.createNewFitButton(); }}>
                            <h1>Create<br />New<br />Fit</h1>
                            {(wardrobe_list => {
                                if (wardrobe_list.length == 0) {
                                    // do nothing
                                } else if (wardrobe_list.length == 1) {
                                    return (<div><div className="homepage_box_background" style={{ top: '0', left: '0', width: '100%', height: '100%', borderRadius: 'inherit', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div></div>);
                                } else if (wardrobe_list.length == 2) {
                                    return (<div>
                                        <div className="homepage_box_background" style={{ top: '0', left: '0', width: '50%', height: '100%', borderRadius: '20px 0 0 20px', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                        <div className="homepage_box_background" style={{ top: '0', right: '0', width: '50%', height: '100%', borderRadius: '0 20px 20px 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                    </div>);
                                } else if (wardrobe_list.length == 3) {
                                    return (<div>
                                        <div className="homepage_box_background" style={{ top: '0', left: '0', width: '50%', height: '50%', borderRadius: '20px 0 0 0', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                        <div className="homepage_box_background" style={{ top: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 20px 0 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                        <div className="homepage_box_background" style={{ bottom: '0', left: '0', width: '100%', height: '50%', borderRadius: '0 0 20px 20px', backgroundImage: `url(${wardrobe_list[2].image_path})` }}></div>
                                    </div>);
                                } else if (wardrobe_list.length >= 4) {
                                    return (<div>
                                        <div className="homepage_box_background" style={{ top: '0', left: '0', width: '50%', height: '50%', borderRadius: '20px 0 0 0', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                        <div className="homepage_box_background" style={{ top: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 20px 0 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                        <div className="homepage_box_background" style={{ bottom: '0', left: '0', width: '50%', height: '50%', borderRadius: '0 0 0 20px', backgroundImage: `url(${wardrobe_list[2].image_path})` }}></div>
                                        <div className="homepage_box_background" style={{ bottom: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 0 20px 0', backgroundImage: `url(${wardrobe_list[3].image_path})` }}></div>

                                    </div>);
                                }
                                return (<div style={{ display: 'none' }}></div>);
                            })(this.state.wardrobeItems)}
                        </button>
                    </div>
                    <div className="homepage_box">
                        <button className="homepage_box_content" onClick={_ => { this.mostRecentFitButton(); }}>
                            <h1>Most<br />Recent<br />Fit</h1>
                            {(outfit_list => {
                                if (outfit_list.length >= 1) {
                                    // console.log('outfit_list', outfit_list);
                                    var wardrobe_list = outfit_list[0].clothes;
                                    wardrobe_list = this.getItemsByIds(wardrobe_list);
                                    // console.log(wardrobe_list);
                                    if (wardrobe_list.length == 0) {
                                        // do nothing
                                    } else if (wardrobe_list.length == 1) {
                                        return (<div><div className="homepage_box_background" style={{ top: '0', left: '0', width: '100%', height: '100%', borderRadius: 'inherit', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div></div>);
                                    } else if (wardrobe_list.length == 2) {
                                        return (<div>
                                            <div className="homepage_box_background" style={{ top: '0', left: '0', width: '50%', height: '100%', borderRadius: '20px 0 0 20px', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                            <div className="homepage_box_background" style={{ top: '0', right: '0', width: '50%', height: '100%', borderRadius: '0 20px 20px 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                        </div>);
                                    } else if (wardrobe_list.length == 3) {
                                        return (<div>
                                            <div className="homepage_box_background" style={{ top: '0', left: '0', width: '50%', height: '50%', borderRadius: '20px 0 0 0', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                            <div className="homepage_box_background" style={{ top: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 20px 0 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                            <div className="homepage_box_background" style={{ bottom: '0', left: '0', width: '100%', height: '50%', borderRadius: '0 0 20px 20px', backgroundImage: `url(${wardrobe_list[2].image_path})` }}></div>
                                        </div>);
                                    } else if (wardrobe_list.length >= 4) {
                                        return (<div>
                                            <div className="homepage_box_background" style={{ top: '0', left: '0', width: '50%', height: '50%', borderRadius: '20px 0 0 0', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                            <div className="homepage_box_background" style={{ top: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 20px 0 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                            <div className="homepage_box_background" style={{ bottom: '0', left: '0', width: '50%', height: '50%', borderRadius: '0 0 0 20px', backgroundImage: `url(${wardrobe_list[2].image_path})` }}></div>
                                            <div className="homepage_box_background" style={{ bottom: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 0 20px 0', backgroundImage: `url(${wardrobe_list[3].image_path})` }}></div>

                                        </div>);
                                    }
                                }
                                return (<div style={{ display: 'none' }}></div>);
                            })(this.state.outfitList)}
                        </button>
                    </div>
                    <div className="homepage_box">
                        <button className="homepage_box_content" onClick={_ => { this.getInspired(); }}>
                            <h1>Get<br />Inspired</h1>
                            <div className="homepage_box_background" style={{ top: '0', left: '0', width: '50%', height: '50%', borderRadius: '20px 0 0 0', backgroundImage: `url(${this.state.image_preview[0]})` }}></div>
                            <div className="homepage_box_background" style={{ top: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 20px 0 0', backgroundImage: `url(${this.state.image_preview[1]})` }}></div>
                            <div className="homepage_box_background" style={{ bottom: '0', left: '0', width: '100%', height: '50%', borderRadius: '0 0 20px 20px', backgroundImage: `url(${this.state.image_preview[2]})` }}></div>
                        </button>

                    </div>
                </div>
                <div style={{ width: '90%', margin: '70px auto 0' }}>
                    <h1 className="homepage_inspiration_message" style={{ letterSpacing: '1.5px' }}>{this.state.inspiration_message_second}</h1>
                </div>
                <div className="homepage_preview_wrapper" style={{ textAlign: (this.state.outfitList.length == 0 ? 'center' : 'left') }}>
                    {(this.state.outfitList.length > 0 ? (Object.keys(this.state.outfitList).map((i) => {
                        if (i > 3) return;
                        var outfit = this.state.outfitList[i];
                        var wardrobe_list = outfit.clothes;
                        wardrobe_list = this.getItemsByIds(wardrobe_list);
                        // console.log(wardrobe_list);
                        return (<div key={i.toString()} className="homepage_preview">
                            <button className="homepage_preview_content" onClick={_ => { this.openOutfit(outfit.id); }}>
                                {(wardrobe_list => {
                                    if (wardrobe_list.length == 0) {
                                        // do nothing
                                    } else if (wardrobe_list.length == 1) {
                                        return (<div><div className="homepage_preview_background" style={{ top: '0', left: '0', width: '100%', height: '100%', borderRadius: 'inherit', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div></div>);
                                    } else if (wardrobe_list.length == 2) {
                                        return (<div>
                                            <div className="homepage_preview_background" style={{ top: '0', left: '0', width: '50%', height: '100%', borderRadius: '20px 0 0 20px', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                            <div className="homepage_preview_background" style={{ top: '0', right: '0', width: '50%', height: '100%', borderRadius: '0 20px 20px 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                        </div>);
                                    } else if (wardrobe_list.length == 3) {
                                        return (<div>
                                            <div className="homepage_preview_background" style={{ top: '0', left: '0', width: '50%', height: '50%', borderRadius: '20px 0 0 0', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                            <div className="homepage_preview_background" style={{ top: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 20px 0 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                            <div className="homepage_preview_background" style={{ bottom: '0', left: '0', width: '100%', height: '50%', borderRadius: '0 0 20px 20px', backgroundImage: `url(${wardrobe_list[2].image_path})` }}></div>
                                        </div>);
                                    } else if (wardrobe_list.length >= 4) {
                                        return (<div>
                                            <div className="homepage_preview_background" style={{ top: '0', left: '0', width: '50%', height: '50%', borderRadius: '20px 0 0 0', backgroundImage: `url(${wardrobe_list[0].image_path})` }}></div>
                                            <div className="homepage_preview_background" style={{ top: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 20px 0 0', backgroundImage: `url(${wardrobe_list[1].image_path})` }}></div>
                                            <div className="homepage_preview_background" style={{ bottom: '0', left: '0', width: '50%', height: '50%', borderRadius: '0 0 0 20px', backgroundImage: `url(${wardrobe_list[2].image_path})` }}></div>
                                            <div className="homepage_preview_background" style={{ bottom: '0', right: '0', width: '50%', height: '50%', borderRadius: '0 0 20px 0', backgroundImage: `url(${wardrobe_list[3].image_path})` }}></div>

                                        </div>);
                                    }
                                })(wardrobe_list)}
                            </button>
                        </div>);
                    })) : (<span style={{ fontSize: '22px', fontStyle: 'italic' }}><br />{'Create a new fit to see it here!'}</span>))}
                </div>
                <div style={{ height: '50px' }}></div>
            </div>
        );
    }
}

export default withRouter(Home);