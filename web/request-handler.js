var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelp = require('./http-helpers');

var actions = {
  'GET': handleGet,
  'POST': handlePost
};

exports.handleRequest = function (req, res) {
  var method = req.method;

  if (method in actions) {
    actions[method](req, res);
  }
};

var handleGet = function(req, res) {
  if (req.url === '/') {
    var indexPath = archive.paths.siteAssets + '/index.html';
    httpHelp.serveAssets(res, indexPath, function(err, data) {
      res.end(data);
    });
  } else {
    var archivedPath = archive.paths.archivedSites + req.url;
    httpHelp.serveAssets(res, archivedPath, function(err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.end(data);
      }
    });
  }
};

var handlePost = function(req, res) {

};
