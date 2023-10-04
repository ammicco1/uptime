"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config({path: "./.env/.env"});
const redis = require("redis");

const uptime = require("./uptime"); // import uptime checking functions

const server = express();
const port = process.env.UPTIMEPORT || 3000;

const client = redis.createClient({ // connect to redis db
    url: process.env.REDISURL || "redis://172.17.0.2:6379"
});

var intervals = {}; // store intervals to stop them

client.on("error", function(err){
    console.log("Redis client error", err);
});

client.connect(); 

server.use(bodyParser.json());
server.use(express.static(`${__dirname}/public`));
server.set("view-engine", "ejs");

restart(); // to resume the uptime check after stop

server.listen(port, function(){
    console.debug(`Uptime server up on port ${port}`);
});

server.get("/", async function(req, res){
    let site = req.query.site;
    let list = {};
    let keys = site ? [site] : await client.keys("*[^info]"); 

    await populate(list, keys);
    
    res.send(list);
});

server.get("/info", async function(req, res){
    let site = req.query.site;

    let list = {};
    let keys = site ? [`${site}:info`] : await client.keys("*:info");

    await populate(list, keys);

    res.send(list);
});

server.post("/getInfo", async function(req, res){
    await client.set(req.body.hostname, req.body.status);

    res.send("Received");
});

server.post("/removeInfo", async function(req, res){
    await client.del(req.body.hostname);
    await client.del(`${req.body.hostname}:info`);

    res.send("Deleted");
});

server.post("/startCheck", async function(req, res){
    let info = req.body;

    await startUptime(info);    

    res.send("Started");
});

server.post("/stopCheck", async function(req, res){
    clearInterval(intervals[req.body.hostname]);

    delete intervals[req.body.hostname];

    if(req.body.remove == "true"){
        await client.del(req.body.hostname);
        await client.del(`${req.body.hostname}:info`);
    }

    res.send(req.body.remove == "true" ? "Permanently stopped" : "Momentarily stopped");
});

async function populate(list, keys){
    for(let i = 0; i < keys.length; i++){
        list[keys[i]] = keys[i].includes(":info") ? JSON.parse(await client.get(keys[i])) : await client.get(keys[i]);
    }
}

async function startUptime(info){
    await client.set(`${info.hostname}:info`, JSON.stringify(info));

    switch(info.type){
        case "http": intervals[info.hostname] = setUptimeCheckHttp(
            info.codes ? JSON.parse(info.codes) : [200], 
            info.method ? info.method : "GET", 
            info.hostname, 
            info.path ? info.path : "", 
            info.port ? info.port : 80, 
            info.interval ? info.interval : 5000); break;
        case "https": intervals[info.hostname] = setUptimeCheckHttps(
            info.codes ? JSON.parse(info.codes) : [200], 
            info.method ? info.method : "GET", 
            info.hostname, 
            info.path ? info.path : "", 
            info.port ? info.port : 443, 
            info.interval ? info.interval : 5000); break;
        case "ping": intervals[info.hostname] = setUptimeCheckPing(
            info.hostname, 
            info.interval ? info.interval : 5000); break;
        default: intervals[info.hostname] = setUptimeCheckPing(
            info.hostname, 
            info.interval ? info.interval : 5000); 
    }
}

function setUptimeCheckHttp(codes, method, hostname, path, port, interval){
    uptime.sendHttp(codes, method, hostname, path, port); 

    let i = setInterval(function(){
        uptime.sendHttp(codes, method, hostname, path, port);
    }, interval);

    return i;
}

function setUptimeCheckHttps(codes, method, hostname, path, port, interval){
    uptime.sendHttps(codes, method, hostname, path, port); 

    let i = setInterval(function(){
        uptime.sendHttps(codes, method, hostname, path, port);
    }, interval);

    return i;
}

function setUptimeCheckPing(hostname, interval){
    uptime.sendPing(hostname); 

    let i = setInterval(function(){
        uptime.sendPing(hostname);
    }, interval);

    return i;
}

async function restart(){
    let keys = await client.keys("*[info]");

    for(var i = 0; i < keys.length; i++){
        var val = await client.get(keys[i]);

        startUptime(JSON.parse(val));
    }
}