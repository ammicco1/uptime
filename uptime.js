"use strict";

const http = require("http");
const https = require("https");
const ping = require("ping");

module.exports = { 
    sendPing: function(host){
        const postOptions = {
            port: 3000,
            hostname: "localhost",
            path: "/getInfo",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        let status = {
            type: "ping",
            hostname: host
        };

        ping.sys.probe(host, function(isUp){
            isUp ? status["status"] = "up" : status["status"] = "down";

            postOptions.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(status));

            let post = http.request(postOptions, function(res2){
                res2.on("data", function(chunk){});
                res2.on("end", function(){});
            }).on("error", function(err){
                console.error(err);
            });
        
            post.write(JSON.stringify(status));
            post.end();
        }, {extra: ["-c", "1"]});
    },
    sendHttp: function(acceptedCode, method, host, path, port){
        const postOptions = {
            port: 3000,
            hostname: "localhost",
            path: "/getInfo",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        let status = {
            type: "http",
            hostname: host
        };

        const options = {
            port: port ? port : 80,
            hostname: host,
            path: path ? path : "",
            method: method
        };

        http.request(options, function(res){
            acceptedCode.includes(res.statusCode) ? status["status"] = "up" : status["status"] = "down";

            postOptions.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(status));

            let post = http.request(postOptions, function(res2){
                res2.on("data", function(chunk){});
                res2.on("end", function(){});
            }).on("error", function(err){
                console.error(err);
            });
        
            post.write(JSON.stringify(status));
            post.end();
        
            res.on("data", function(chunk){});
            res.on("end", function(){});
        }).on("error", function(err){
            console.error("Error: ", err);
        }).end();
    },
    sendHttps: function(acceptedCode, method, host, path, port){
        const postOptions = {
            port: 3000,
            hostname: "localhost",
            path: "/getInfo",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        let status = {
            type: "https",
            hostname: host
        };

        const options = {
            port: port ? port : 443,
            hostname: host,
            path: path ? path : "",
            method: method
        };

        https.request(options, function(res){
            acceptedCode.includes(res.statusCode) ? status["status"] = "up" : status["status"] = "down";

            postOptions.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(status));

            let post = http.request(postOptions, function(res2){
                res2.on("data", function(chunk){});
                res2.on("end", function(){});
            }).on("error", function(err){
                console.error(err);
            });
        
            post.write(JSON.stringify(status));
            post.end();
        
            res.on("data", function(chunk){});
            res.on("end", function(){});
        }).on("error", function(err){
            console.error("Error: ", err);
        }).end();
    }   
}   