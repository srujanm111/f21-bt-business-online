/* FITCHECK
 * API BACKEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// utilities for backend

const util = require("util");
const rn = require('random-number');
const readline = require("readline");

utils = {
    // creates a cli interface
    input: readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    // returns a message/error logger
    logger: (id, as_error) => {
        var e = as_error ? true : false;
        var logger_obj = (...args) => {
            var msg = "";
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (typeof arg === 'object' && arg !== null)
                    arg = _util.inspect(arg, {
                        showHidden: false, depth: logger_obj.depth, colors: true, compact: false
                    });
                msg += `${arg}${i < args.length - 1 ? ' ' : ''}`;
            }
            if (e) {
                msg = `* [${id}] ERROR: ${msg}`;
                console.error(msg);
            } else {
                msg = `[${id}] ${msg}`;
                console.log(msg);
            }
        };
        logger_obj.depth = null;
        return logger_obj;
    },
    // non-blocking delayed callback
    delay: (callback, timeout) => {
        setTimeout(_ => {
            process.nextTick(callback);
        }, timeout);
    },
    // generate random alphanumeric key
    rand_id: (length = 10) => {
        var key = "";
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < length; i++)
            key += chars[rn({
                min: 0,
                max: chars.length - 1,
                integer: true
            })];
        return key;
    },
    // left pad string
    lpad: (s, width, char) => {
        return s.length >= width
            ? s
            : (new Array(width).join(char) + s).slice(-width);
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
    // verify alphanumeric
    validateAlphanumeric_str: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    validateAlphanumeric: (str) => {
        for (var i = 0; i < str.length; i++) {
            if (!utils.validateAlphanumeric_str.includes(str[i]))
                return false;
        }
        return true;
    },
    // verify numeric
    validateNumeric_str: "0123456789",
    validateNumeric: (value) => {
        for (var v in value) {
            if (!utils.validateNumeric_str.includes(value[v])) {
                return false;
            }
        }
        return true;
    },
    // cross-origin headers (middleware for express)
    web_cors: (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
};

module.exports = utils;