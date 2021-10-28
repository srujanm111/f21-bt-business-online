/* FITCHECK
 * API BACKEND
 * CVGT F21-BT-BUSINESS-ONLINE
 */

// backend server main


// imports
const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const mongodb = require('mongodb');
const readline = require("readline");
const utils = require("./utils");


// environment
global.args = process.argv.slice(2);
global.env = global.args[0] == "--production" ? "prod" : "dev";
global.config = JSON.parse(fs.readFileSync('./config.json', { encoding: 'utf8', flag: 'r' }));
global.http_port = global.env == "dev" ? 8000 : global.config.http_port;
global.mongo_port = global.env == "dev" ? 27017 : global.config.mongo_port;
global.mongo_db_id = global.config.mongo_db_id;


// express web server
var express_api = null;
var http_server = null;
// initialize express web server
function express_setup() {
    express_api = express();
    // express_api.set('view engine', 'ejs');
    http_server = http.Server(express_api);
    express_api.use(express.json());
    express_api.use(express.urlencoded({ extended: true }));
    express_api.use(utils.web_cors);
    // express_api.use(express.static("static"));
    express_api.get("/", (req, res) => {
        res.send("Hello World");
    });
}
// run express web server
function express_start(next) {
    express_api.listen(global.http_port, _ => {
        console.log("express web server now listening on", global.http_port);
        if (next) next();
    });
}
// respond to express web request with an http error
function express_return_error(req, res, code, msg) {
    res.status(code);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify({
        status: code,
        success: false,
        message: msg
    }, null, 2));
}


// main entry point
function main() {
    express_setup();
    express_start(_ => {
        console.log("backend ready");
    });
}


// run main when ready
main();