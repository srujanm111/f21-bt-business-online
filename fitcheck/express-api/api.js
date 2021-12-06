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
const ejwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const utils = require("./utils");
const cors = require("cors");


// environment
global.args = process.argv.slice(2);
global.env = global.args[0] == "--production" ? "prod" : "dev";
global.config = JSON.parse(fs.readFileSync('./config.json', { encoding: 'utf8', flag: 'r' }));
global.http_port = global.env == "dev" ? 8000 : global.config.http_port;
global.mongo_port = global.env == "dev" ? 27017 : global.config.mongo_port;

// mongodb api
var mongo_api = null;
var mongo_client = null;
var mongo_url = "mongodb://localhost:" + global.mongo_port;
// initialize mongodb client
function db_setup(next) {
    console.log("[db]", "connecting to", mongo_url);
    mongodb.MongoClient.connect(mongo_url, { useUnifiedTopology: true }, (e, client) => {
        if (e) console.err("[db]", "connection error", e.message ? e.message : e);
        else {
            console.log("[db]", "connected");
            mongo_client = client;
            mongo_api = client.db(global.config.mongo_db_id);
            next();
        }
    });
}
// check authentication
function db_authenticate(username, password, resolve) {
    mongo_api.collection('user').findOne({
        username: username, password: password
    }, (e, item1) => {
        if (e) {
            console.err("[db]", `error in authentication for user ${username}`, e.message ? e.message : e);
            resolve(false, e);
        } else {
            if (item1 == null)
                resolve(null);
            else resolve(item1);
        }
    });
}
// check if user exists
function db_user_exists(username, resolve) {
    mongo_api.collection('user').findOne({
        username: username
    }, (e, item1) => {
        if (e) {
            console.err("[db]", `error finding user ${username}`, e.message ? e.message : e);
            resolve(false, e);
        } else {
            if (item1 == null)
                resolve(null);
            else resolve(item1);
        }
    });
}
// create new user
function db_create_user(username, new_password, resolve) {
    mongo_api.collection('user').insertOne({
        username: username,
        password: new_password
    }, (e, result1) => {
        if (e) {
            console.err("[db]", `error creating user with username ${username}`, e.message ? e.message : e);
            resolve(false, e);
        } else resolve(true, result1);
    });
}
// create new outfit
function db_create_outfit(user_id, name, price_total = 0, resolve) {
    mongo_api.collection('outfit').insertOne({
        name: name,
        price_total: price_total,
        clothes: [],
        user: user_id
    }, (e, result1) => {
        if (e) {
            console.err("[db]", `error creating outfit with name ${name}`, e.message ? e.message : e);
            resolve(false, e);
        } else resolve(true, result1);
    });
}
// get outfits
function db_get_outfits(user_id, resolve) {
    mongo_api.collection('outfit').find({
        user: user_id
    }, (e, cursor1) => {
        if (e) {
            console.err("[db]", `error deleting outfit ${id}`, e.message ? e.message : e);
            resolve(false, e);
        } else resolve(cursor1.toArray());
    });
}
// delete outfit
function db_delete_outfit(id, resolve) {
    mongo_api.collection('outfit').deleteOne({
        _id: mongodb.ObjectId(id)
    }, (e, result1) => {
        if (e) {
            console.err("[db]", `error deleting outfit ${id}`, e.message ? e.message : e);
            resolve(false, e);
        } else resolve(true, result1);
    });
}
// create new clothing item
function db_create_clothing_item(user_id, name, price, product_url, image_path, store_name, resolve) {
    mongo_api.collection('clothing').insertOne({
        name: name,
        price: price,
        product_url: product_url,
        image_path: image_path,
        store_name: store_name,
        user: user_id
    }, (e, result1) => {
        if (e) {
            console.err("[db]", `error creating outfit with name ${name}`, e.message ? e.message : e);
            resolve(false, e);
        } else resolve(result1.insertedId, result1);
    });
}
// get clothing items
function db_get_clothing_items(user_id, resolve) {
    mongo_api.collection('clothing').find({
        user: user_id
    }).toArray((e, items) => {
        if (e) {
            console.err("[db]", `error getting clothing items for user ${user_id}`, e.message ? e.message : e);
            resolve(false, e);
        } else resolve(items);
    });
}
// delete clothing item
function db_delete_clothing_item(id, resolve) {
    mongo_api.collection('clothing').deleteOne({
        _id: mongodb.ObjectId(id)
    }, (e, result1) => {
        if (e) {
            console.err("[db]", `error deleting clothing item ${id}`, e.message ? e.message : e);
            resolve(false, e);
        } else resolve(true, result1);
    });
}
// close mongodb connection
function db_exit(next) {
    mongo_client.close();
    next();
}


// express web server
var express_api = null;
var http_server = null;
// initialize express web server
function web_setup() {
    console.log("[web]", "initializing");
    express_api = express();
    // express_api.set('view engine', 'ejs');
    http_server = http.Server(express_api);
    express_api.use(express.json());
    express_api.use(express.urlencoded({ extended: true }));
    // express_api.use(cors);
    express_api.use(utils.web_cors);
    // express_api.use(express.static("static"));
    express_api.get("/", (req, res) => {
        res.status(200).end();
    });
    web_routing();
}
// run express web server
function web_start(next) {
    express_api.listen(global.http_port, _ => {
        console.log("[web]", "listening on", global.http_port);
        if (next) next();
    });
}
// respond to express web request with json data
function web_return_data(req, res, data) {
    res.status(200);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
    return null;
}
// respond to express web request with an http error (with json data)
function web_return_error(req, res, code, msg) {
    res.status(code);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify({
        status: code,
        message: msg
    }, null, 2));
}
// generate auth token
function web_issue_token(username) {
    return jwt.sign(
        { username: (`${username}`).trim() },
        global.config.jwt.secret,
        { algorithm: global.config.jwt.algo }
    );
}
// verify auth token
function web_verify_token(token) {
    var result = null;
    try {
        result = jwt.verify(token, global.config.jwt.secret);
    } catch (e) {
        console.log(`[web] error verifying token "${token}":`, (e.message ? e.message : e));
        result = null;
    }
    return result;
}
// verify auth token (express middleware)
function web_require_token() {
    return ejwt({
        secret: global.config.jwt.secret,
        algorithms: [global.config.jwt.algo]
    });
}
// attach express route events
function web_routing() {

    /* api */
    express_api.get("/api", (req, res) => {
        // base endpoint
        console.log("[web]", "hello world");
        res.send("FitCheck");
    });

    /* auth */
    // sign in
    express_api.post("/api/sign_in", (req, res) => {
        // validate input (username, password)
        if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password'))
            return web_return_error(req, res, 400, "Missing username or password");
        if (!req.body.username || (`${req.body.username}`).trim().length < 2)
            return web_return_error(req, res, 400, "Invalid username (too short)");
        req.body.username = (`${req.body.username}`).trim();
        if (!utils.validateAlphanumeric(req.body.username))
            return web_return_error(req, res, 400, "Invalid username (letters/numbers only)");
        if (!req.body.password || (`${req.body.password}`).trim().length < 2)
            return web_return_error(req, res, 400, "Invalid password (too short)");
        // verify user exists
        db_user_exists(req.body.username, (result1, e1) => {
            if (result1 === false) return web_return_error(req, res, 500, "Database error");  // `Database error: ${e1.message ? e1.message : e1.toString()}`
            if (result1 === null) return web_return_error(req, res, 400, "User not found");
            // verify username+password
            db_authenticate(req.body.username, req.body.password, (result2, e2) => {
                if (result2 === false) return web_return_error(req, res, 500, "Database error");  //  `Database error: ${e2.message ? e2.message : e2.toString()}`
                if (result2 === null) return web_return_error(req, res, 401, "Incorrect password");
                // issue new token
                var token = web_issue_token(req.body.username);
                return web_return_data(req, res, { token: token });
            });
        });
    });
    // sign up
    express_api.post("/api/sign_up", (req, res) => {
        // validate input (new_username, new_password)
        if (!req.body.hasOwnProperty('new_username') || !req.body.hasOwnProperty('new_password'))
            return web_return_error(req, res, 400, "Missing new username or new password");
        if (!req.body.new_username || (`${req.body.new_username}`).trim().length < 2)
            return web_return_error(req, res, 400, "Invalid new username (too short)");
        req.body.new_username = (`${req.body.new_username}`).trim();
        if (!utils.validateAlphanumeric(req.body.new_username))
            return web_return_error(req, res, 400, "Invalid new username (letters/numbers only)");
        if (!req.body.new_password || (`${req.body.new_password}`).trim().length < 2)
            return web_return_error(req, res, 400, "Invalid new password (too short)");
        // verify user does not already exist
        db_user_exists(req.body.new_username, (result1) => {
            if (result1 === false) return web_return_error(req, res, 500, "Database error");
            if (result1 != null) return web_return_error(req, res, 400, "Username already taken");
            // create user with username+password
            db_create_user(req.body.new_username, req.body.new_password, (result2) => {
                if (result2 === false) return web_return_error(req, res, 500, "Database error");
                if (result2 === null) return web_return_error(req, res, 500, "Failed to create user");
                // issue new token
                var token = web_issue_token(req.body.new_username);
                return web_return_data(req, res, { token: token });
            });
        });
    });
    // authenticate token
    express_api.get("/api/auth", web_require_token() /* middleware decodes JWT */, (req, res) => {
        // verify decoded user exists
        db_user_exists(req.user.username, (user) => {
            if (user === false) return web_return_error(req, res, 500, "Database error");
            if (user === null) return web_return_error(req, res, 400, "User not found");
            // authenticate user
            return web_return_data(req, res, { username: req.user.username });
        });
    });
    express_api.get("/api/auth_alt", (req, res) => {
        // authenticate token
        req.user = web_verify_token(req.body.token);
        if (req.user == null) return web_return_error(req, res, 401, "Unauthorized");
        // verify decoded user exists
        db_user_exists(req.user.username, (user) => {
            if (user === false) return web_return_error(req, res, 500, "Database error");
            if (user === null) return web_return_error(req, res, 400, "User not found");
            // authenticate user
            return web_return_data(req, res, { username: req.user.username });
        });
    });

    /* outfits */

    /* clothes */
    // create clothing item
    express_api.post("/api/create_clothing", (req, res) => {
        // authenticate token
        req.user = web_verify_token(req.body.token);
        if (req.user == null) return web_return_error(req, res, 401, "Unauthorized");
        // verify authenticated user exists
        db_user_exists(req.user.username, (user) => {
            if (user === false) return web_return_error(req, res, 500, "Database error");
            if (user === null) return web_return_error(req, res, 400, "User not found");
            // create clothing item
            db_create_clothing_item(user._id.toString(), req.body.name, parseFloat(req.body.price), req.body.page_url, req.body.image_url, req.body.store_name, (item_id) => {
                if (item_id === false) return web_return_error(req, res, 500, "Database error");
                return web_return_data(req, res, { id: item_id.toString() });
            });
        });
    });
    // get clothing items
    express_api.post("/api/get_clothing", (req, res) => {
        // authenticate token
        req.user = web_verify_token(req.body.token);
        if (req.user == null) return web_return_error(req, res, 401, "Unauthorized");
        // verify authenticated user exists
        db_user_exists(req.user.username, (user) => {
            if (user === false) return web_return_error(req, res, 500, "Database error");
            if (user === null) return web_return_error(req, res, 400, "User not found");
            // get clothing items
            db_get_clothing_items(user._id.toString(), (item_list) => {
                if (item_list === false) return web_return_error(req, res, 500, "Database error");
                var result_list = [];
                for (var i_l in item_list) {
                    result_list.push({
                        name: item_list[i_l].name,
                        price: item_list[i_l].price,
                        product_url: item_list[i_l].product_url,
                        image_path: item_list[i_l].image_path,
                        store_name: item_list[i_l].store_name,
                        user: item_list[i_l].user,
                        id: item_list[i_l]._id.toString()
                    });
                }
                return web_return_data(req, res, { list: result_list });
            });
        });
    });
}
// close web server
function web_exit(next) {
    http_server.close(next);
}


// command line interface
function cli_setup(next) {
    console.log("[cli]", "initializing");
    utils.input.on('line', (line) => {
        var line_text = '';
        line = line.trim();
        if (line != '') {
            line_text = line;
            line = line.split(' ');
            if (line[0] == "db" || line[0] == "database") {
                if (line[1] == "save") {
                    // database.save(line[2] && line[2] == "pretty");
                }
            } else if (line[0] == "test") {
                console.log("[cli]", "running tests");
                main_test(_ => {
                    console.log("[cli]", "tests complete");
                });
            } else if (line[0] == "code" || line[0] == "eval") {
                if (line.length > 1 && line[1] != "") {
                    line_text = line_text.substring(4);
                    var ret = eval(line_text);
                    if (ret !== undefined) console.log(ret);
                }
            } else if (line[0] == "clear" || line[0] == "c") {
                console.clear();
            } else if (line[0] == "exit" || line[0] == "quit" || line[0] == "q") {
                main_exit(0, _ => {
                    console.log("[cli]", "bye");
                });
            }
        }
    });
    if (next) next();
}


// main method
function main() {
    console.log("FITCHECK");
    console.log("[main]", "backend initializing");
    // set up database
    db_setup(_ => {
        // set up web server
        web_setup();
        web_start(_ => {
            // set up cli
            cli_setup(_ => {
                // ready
                console.log("[main]", "backend ready");
            });
        });
    });
}
// test method
function main_test(next = null) {
    console.log("[main]", "testing");
    // TODO: add some tests here
    if (next) next();
}
// exit method
function main_exit(e, next = null) {
    web_exit(_ => {
        db_exit(_ => {
            if (next) next();
            process.exit(e);
        });
    });
}


// entry point
main();