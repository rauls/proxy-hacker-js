#!/usr/bin/env node
//#------------------------
////# Author: Raul Sobon
////#------------------------

var util = require('util');
var http = require('http'),
    httpProxy = require('http-proxy');
var URL = require('url');

// This included JS can be replaced by any custom default.pac proxy file that usually goes to browsers.
var mh = require('sample_default.pac');

var FindProxyForURL = mh.FindProxyForURL;

var log = console.log;

log("Starting proxy-hacker");

var options = {
  router :  { },
  forward:  { },
};

function handler(req,res,proxy)
{
    var h = req.headers;
    var url = URL.parse( req.url, true );
    
    log("host : " + url.hostname + ' port :' + url.port  );
//    log("url : " + util.inspect(url,false,2) );
    var ret = 'DIRECT';
    
    // We can add a custom modifier here to change the requested params/posted JSON data if you wish to hack
    // Any web apps or games or clients which post data, and replace values with your own to do magic stuff
    
    if( url.hostname.charAt(0) != '1' )
        ret = FindProxyForURL( url.pathname, h.host );
        
    if( ret == 'DIRECT' ) 
    {
      proxy.proxyRequest(req, res, {
          host: url.hostname,
          port: url.port || 80
          });    
    } 
    else
    {
      var hosts = ret.split(';');
      var tmp = hosts[0].split(' ');
      var host = tmp[1].split(':');
      log("GET via " + ret + " " + req.url ); 
      proxy.proxyRequest(req, res, {
          host: host[0],
          port: 80
          });    
    }    
}


// See https://github.com/nodejitsu/node-http-proxy page on how to add your own data manipulation 
// on response content.
var server_port = 81;
//
var proxyServer = httpProxy.createServer( handler );
// Create a proxy server with custom application logic
//
proxyServer.on('error', function(err) {
    last_port = server_port;
    if (server_port < 1024 && process.getuid() !== 0) {// if we are not root, use valid ports
        server_port = 1024;
    } else {
        server_port++;
    }
    console.log("Failed to listen server port : " + last_port + ' error ' + err.toString() + ', trying next port ' + server_port);
    setTimeout( function(s){s.listen(server_port);} , 1*1000, proxyServer );
});

proxyServer.listen( server_port );

