/*
 * Attempt to document the following type of code:
 *   Asynchronous code with callbacks
 *   Node.js-style programming model
 */

var http = require('http')
  , fs = require('fs')
  , crypto = require('crypto');


// HTTP SERVER
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// http://nodejs.org/api/stream.html#stream_api_for_stream_consumers

var server = http.createServer(function (req, res) {
  var body = '';
  req.setEncoding('utf8');

  req.on('data', function (chunk) {
    body += chunk;
  })

  req.on('end', function () {
    try {
      var data = JSON.parse(body);
    } catch (er) {
      res.statusCode = 400;
      return res.end('error: ' + er.message);
    }

    res.write(typeof data);
    res.end();
  })
})

server.listen(1337);


// FILE SYSTEM
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// http://nodejs.org/api/fs.html#fs_file_system

fs.readFile('/etc/passwd', function (err, data) {
  if (err) throw err;
  console.log(data);
});


fs.rename('/tmp/hello', '/tmp/world', function (err) {
  if (err) throw err;
  fs.stat('/tmp/world', function (err, stats) {
    if (err) throw err;
    console.log('stats: ' + JSON.stringify(stats));
  });
});


// CRYPTO
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// http://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm

var filename = process.argv[2]
  , shasum = crypto.createHash('sha1');

var s = fs.ReadStream(filename);
s.on('data', function(d) {
  shasum.update(d);
});

s.on('end', function() {
  var d = shasum.digest('hex');
  console.log(d + '  ' + filename);
});
