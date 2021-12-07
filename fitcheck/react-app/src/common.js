// common globals
// shared API methods and utility functions

import axios from 'axios';
import hash from 'hash.js';

// client config
global.config = {
    // config vars
    api_token: null,  // dynamic
    report_web_vitals: false,
    // control views
    api_route: 'api',
    landing_view: 'landing',
    auth_home_view: 'wardrobe',
    // control urls
    api_url: `${window.location.protocol}//${window.location.host}`,  // initial value
    landing_url: `${window.location.protocol}//${window.location.host}`,
    auth_home_url: `${window.location.protocol}//${window.location.host}`,  // initial value
};
global.config.api_url = `${window.location.protocol}//${window.location.host}/${global.config.api_route}`;
global.config.auth_home_url = `${window.location.protocol}//${window.location.host}/${global.config.auth_home_view}`;

// client API (to interact with backend)
global.api = {
    // check current token with server asynchronously
    //  - pass callback as `resolve` to order behavior
    //  - will call `resolve({ success:True, username:"...", token:"..." })` if auth token from cookies is valid/legit & also not expired
    //  - will call `resolve({ success:False, message:"..." })` if auth token from cookies is invalid or expired
    authenticate: resolve => {
        var token = global.util.cookie('token');
        if (!token || token.trim().length <= 0)
            return resolve({ success: false, message: null });
        axios.get(`${global.config.api_url}/auth`, {
            headers: global.util.generate_auth_headers(token)
        }).then(response => {
            if (!response || !response.data || !response.data.hasOwnProperty('username')) {
                console.error(response);
                return resolve({ success: false, message: null });
            }
            return resolve({
                success: true,
                username: response.username,
                token: token
            });
        }).catch(error => {
            console.error(error);
            if (error && error.response && error.response.hasOwnProperty('message'))
                return resolve({
                    success: false, message: error.response.message
                });
            return resolve({ success: false, message: null });
        });
    },
    // sign out with token (delete token cookie and redirect to landing view)
    logout: (redirect = true) => {
        global.util.delete_cookie('token');
        console.log(global.util.cookie('token'));
        if (redirect) {
            setTimeout(_ => {
                global.util.delete_cookie('token');
                window.location = `${global.config.landing_url}/`;
            }, 400);
        }
    },
    // sign in with token (set token cookie and redirect to home view)
    login: (accessToken, redirect = true) => {
        global.util.delete_cookie('token');
        global.util.cookie('token', accessToken);
        if (redirect) window.location = `${global.config.auth_home_url}/`;
    },
    // read current login token from cookies
    get_token: _ => {
        var cookie = global.util.cookie('token');
        if (cookie) return cookie;
        return null;
    }
};

// client utilities (for general use)
global.util = {
    // create or edit cookie (pass "__indefinite__" for date to create a non-expiring cookie)
    cookie: (id, val, date) => {
        if (val == undefined || val === null)
            document.cookie.split('; ').forEach(cookie => {
                if (cookie.substring(0, id.length) == id)
                    val = cookie.substring(id.length + 1);
            });
        else {
            if (date == '__indefinite__')
                date = 'Fri, 31 Dec 9999 23:59:59 GMT';
            document.cookie = id + '=' + val + (";path=/;") +
                ((date != undefined && date !== null) ? '; expires=' + date : '');
        }
        return (val == undefined || val === null) ? null : val;
    },
    // delete existing cookie
    delete_cookie: id => {
        global.util.cookie(id, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
    },
    // left pad string
    lpad: (s, width, char) => {
        return s.length >= width ? s : (new Array(width).join(char) + s).slice(-width);
    },
    // capitalize word
    capitalize: word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    },
    // generate random integer (max&min-inclusive)
    rand_int_inclusive: (low, high) => {
        // both inclusive
        return (Math.floor(Math.random() * (high - low + 1)) + low);
    },
    // generate random integer (max-exclusive & min-inclusive)
    rand_int: (min, max) => {
        // min inclusive, max exclusive
        return Math.floor(Math.random() * (max - min) + min);
    },
    // generate sha256 hash
    sha256: value => {
        return hash.sha256().update(`${value}`).digest('hex');
    },
    // generate secure hash (for passwords, uses sha256)
    hashPassword: (value) => {
        return global.util.sha256(value);
    },
    // confirm if string is letters & numbers only
    validateAlphanumeric: (value) => {
        var alphaNumerics = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var v in value) {
            if (!alphaNumerics.includes(value[v])) {
                return false;
            }
        }
        return true;
    },
    // confirm if string is numbers only
    validateNumeric: (value) => {
        var numerics = '0123456789';
        for (var v in value) {
            if (!numerics.includes(value[v])) {
                return false;
            }
        }
        return true;
    },
    // generate authentication headers from token
    generate_auth_headers: (token) => {
        return { Authorization: `Bearer ${token}` };
    },
    append_period: message => {
        message = `${message}`;
        if (message[message.length - 1] != '.')
            message = `${message}.`;
        return message;
    }
};

