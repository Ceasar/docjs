/*
 * Attempt to document the following type of code:
 *   Asynchronous code with callbacks
 *   Node.js-style programming model
 */

var http = require('http')
  , fs = require('fs')
  , crypto = require('crypto')
  , dgram = require("dgram");


// HTTP SERVER
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// http://nodejs.org/api/stream.html#stream_api_for_stream_consumers

/*
 * @param {Object} req
 * @param {Object} res
 *
 * @pre
 *   req :: {
 *     setEncoding :: Function (String) -> null
 *     on :: Function (String, Function) -> null
 *   }
 *   res :: {
 *     statusCode :: Number
 *     write :: Function (*) -> null
 *     end :: Function (String) -> res
 *   }
 *
 *
 **** Informal spec ****
 *
 *   body <- empty string
 *   setEncoding req with 'utf8'
 *   on req 'data' event, with (chunk):
 *     append chunk to body
 *
 *   on req 'end' event:
 *     data <- try to parse body as JSON
 *       catch error: call res.end with (er.message)
 *     write data to res
 *     call res.end
 *
 **** Optimal spec ****
 *
 * Get request data asynchronously, store as `body`.
 * When request ends, try to parse `body` as JSON (handle errors).
 * If successful, write back the typeof the parsed data to the HTTP response.
 *
 */
var onRequest = (req, res) {
  // {{ [] == [] }}
  var body = '';
  // {{ body == '' }}
  // {{ body == '' /\ 0 == 0 }}
  req.setEncoding('utf8');
  // {{ body == '' /\ req.encoding == 'utf8' }}

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
}

var server = http.createServer(onRequest).listen(1337);


// FILE SYSTEM
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// http://nodejs.org/api/fs.html#fs_file_system

/*
 **** Informal spec ****
 *
 * readFile '/etc/passwd' with callback:
 *   @param {Error} err
 *   @param {Object} data
 *
 **** Optimal spec ****
 *
 * Read file '/etc/passwd' and print its contents (handle errors).
 *
 */
fs.readFile('/etc/passwd', function (err, data) {
  if (err) throw err;
  console.log(data);
});

/*
 **** Informal spec ****
 *
 * rename '/tmp/hello' to '/tmp/world' with callback:
 *   @param {Error} err
 *
 *   handle error
 *
 *   get stats for '/tmp/world' with callback:
 *     @param {Error} err
 *     @param {fsStat} stats
 *
 *     handle error
 *
 **** Optimal spec ****
 *
 * Rename file '/tmp/hello' to '/tmp/world' (handle errors).
 * Print fs stats for the new file (handle errors).
 *
 */
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
  , shasum = crypto.createHash('sha1')
  , s = fs.ReadStream(filename);

/*
 **** Informal spec ****
 *
 * on s 'data' event:
 *   @param {*} d
 *
 *   update shasum with d
 *
 **** Optimal spec ****
 *
 * When s gets file data, update shasum.
 *
 */
s.on('data', function(d) {
  shasum.update(d);
});

/*
 **** Informal spec ****
 *
 * on s 'end' event:
 *   d <- digest shasum with 'hex'
 *   print d, filename
 *
 **** Optimal spec ****
 *
 * When s ends file data, digest shasum as 'hex' and print it with filename.
 *
 */
s.on('end', function() {
  var d = shasum.digest('hex');
  console.log(d + '  ' + filename);
});


// UDP, Sockets
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// http://nodejs.org/api/dgram.html#dgram_socket_bind_port_address_callback

var server = dgram.createSocket("udp4");

/*
 **** Informal spec ****
 *
 * on server 'error' event, with (err):
 *   print err.stack
 *   close server
 *
 **** Optimal spec ****
 *
 * When there is a server error, print it and close the socket connection.
 *
 */
server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

/*
 **** Informal spec ****
 *
 * on server 'message' event, with (msg, rinfo):
 *   print msg, rinfo.address, rinfo.port
 *
 **** Optimal spec ****
 *
 * When there is a socket message, print out its contents and info.
 *
 */
server.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " +
    rinfo.address + ":" + rinfo.port);
});

/*
 **** Informal spec ****
 *
 * on server 'listening' event:
 *   address <- call address on server
 *   print address.address, address.port
 *
 **** Optimal spec ****
 *
 * When we know the socket is listening, get its address and print it.
 *
 */
server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(41234);
// server listening 0.0.0.0:41234

