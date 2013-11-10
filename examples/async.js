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
 * Informal spec:
 *   body is an empty string
 *   setEncoding on req with 'utf8'
 *   on req 'data' event, with (chunk):
 *     append chunk to body
 *
 *   on req 'end' event:
 *     data <- try to parse body as JSON
 *       catch error: call res.end with (er.message)
 *     write data to res
 *     call res.end
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
 * readFile '/etc/passwd' with callback:
 *   @param {Error} err
 *   @param {Object} data
 */
fs.readFile('/etc/passwd', function (err, data) {
  if (err) throw err;
  console.log(data);
});

/*
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
 * on s 'data' event:
 *   @param {*} d
 *
 *   update shasum with d
 */
s.on('data', function(d) {
  shasum.update(d);
});

/*
 * on s 'end' event:
 *   digest shasum as 'hex' to d
 *   print d, filename
 */
s.on('end', function() {
  var d = shasum.digest('hex');
  console.log(d + '  ' + filename);
});

