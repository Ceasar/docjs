function User(name, email) {
  this.name = name
  this.email = email
}

User.prototype.emailHost = function () {
  return this.email.split('@')[1]
}

// Should be able to detect that user is a User object by prototype

/*
 *
 * @pre
 *   user :: User
 * @post
 *   ??
 */
function sendEmail(user) {
  console.log('Sending email to ' +  user.name +  ' (' +  user.emailHost() +  ')')
}




/*
 * @pre
 *   req :: {
 *     timestamp :: number // Knowable because of subtraction
 *     method :: primitive // <- Assume primatives if coerced to strings
 *     path :: primitive
 *     params :: * // Should this know it expects an Object<*>
 *   }
 */
function logRequest(req) {
  var secondsAgo = Date.now() - req.timestamp
  console.log('[' + secondsAgo + ' ago] ' + req.method + ' ' + req.path + ' ' +
              JSON.stringify(req.params))
}



/*
 * @pre
 *   method :: *
 *   path :: *
 * @post
 *   @return {
 *     timestamp :: number
 *     method :: *
 *     path :: *
 *     params :: Object<*>
 *   }
 */
function createRequest(method, path) {
  return {
    timestamp: Date.now(),
    method: method,
    path: path,
    params: {}
  }
}


// After running the following code:
var req1 = createRequest('GET', '/foo')
req1.params['param1'] = 'value1'
logRequest(req1)

var req2 = createRequest('POST', '/bar')
req2.params['name'] = 'Bob'
req2.headers['Content-Type'] = 'application/json'
logRequest(req2)

// DocJS should output a warning:
// WARNING: req2 field `headers` is never used
