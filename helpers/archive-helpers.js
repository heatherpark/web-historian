var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    var urls = data.split('\n').filter(function(element) {
      return element !== '';
    });

    callback(urls);
  });
};

exports.readListOfUrlsAsync = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {

        var urls = data.split('\n').filter(function(element) {
          return element !== '';
        });
        resolve(urls);
      }
    });
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(_.contains(urls, url));
  });
};

exports.isUrlInListAsync = function(url) {
  return exports.readListOfUrlsAsync()
  .then(function(urls) {

    return _.contains(urls, url);
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    exports.isUrlInList(url, function(is) {
      if (!is) {
        fs.appendFile(exports.paths.list.url + '\n');
      }
      callback();
    });
  });
};

exports.addUrlToListAsync = function(url) {
  return exports.readListOfUrlsAsync()
  .then(function(urls) {
    return exports.isUrlInListAsync(url);
  })
  .then(function(is) {
    if (!is) {
      fs.appendFile(exports.paths.list, url + '\n');
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      callback(_.contains(data, url));
    }
  });
};

exports.isUrlArchivedAsync = function(url) {
  return new Promise(function(resolve, reject) {
    fs.readdir(exports.paths.archivedSites, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(_.contains(data, url));
      }
    });
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (exists) {
        http.get('http://' + url + '/index.html', function(response) {
          var data = '';

          response.on('data', function(chunk) {
            data += chunk;
          });

          response.on('end', function() {
            fs.writeFile(exports.paths.archivedSites + '/' + url, data);
          });
        });
      }
    });
  });
};

exports.downloadUrlsAsync = function(urls) {
  urls.forEach(function(url) {
    exports.isUrlArchived(url)
    .then(function(exists) {
      if (exists) {
        http.get('http://' + url + '/index.html', function(response) {
          var data = '';

          response.on('data', function(chunk) {
            data += chunk;
          });

          response.on('end', function() {
            fs.writeFile(exports.paths.archivedSites + '/' + url, data);
          });
        });
      }
    });
  });
};
