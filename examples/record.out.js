// User examlple ////////////////////
/*
 * @param name :: primitive // Can know primative from use with + in sendEmail()
 * @param email :: string // Can know string from use with .split() in User#emailHost()
 * @constructor // Knows because fields on `this` only, and those fields correspond to params
 */
function User(name, email) {
  this.name = name
  this.email = email
}

/*
 * @return :: string // From definition of String#split()
 */
User.prototype.emailHost = function () {
  return this.email.split('@')[1]
}

/*
 * @param user :: User // Knows from use of emailHost()
 * @sideeffects // Knows from definition of console.log()
 */
function sendEmail(user) {
  console.log('Sending email to ' + user.name + ' (' + user.emailHost() + ')')
}


// Obj example ////////////////////
/*
 * @param method :: *
 * @param path :: *
 * @return :: {
 *   timestamp :: number
 *   method :: *
 *   path :: *
 *   params :: Object<*>
 * }
 */
function createObj(method, path) {
  return {
    timestamp: Date.now(),
    method: method,
    path: path,
    params: {}
  }
}

/*
 * @param obj :: {
 *   timestamp :: number // From use with -
 *   method :: primitive // From use with +
 *   path :: primitive // From use with +
 *   params :: *
 * }
 * @sideeffects
 */
function logObj(obj) {
  var secondsAgo = Date.now() - obj.timestamp
  console.log('[' + secondsAgo + ' ago] ' + obj.method + ' ' + obj.path +
              ' ' + JSON.stringify(obj.params))
}

var req1 = createObj('GET', '/foo')
req1.params['param1'] = 'value1'
logObj(req1)

var req2 = createObj('POST', '/bar')
req2.params['name'] = 'Bob'
req2.headers['Content-Type'] = 'application/json'
logObj(req2)

logObj({timestamp: Date.now(), path: '/baz'})

// OUTPUTS:
//   WARNING (line 69): Field `headers` on object `req2` is set but never used
//   ERROR (line 72): Function `logObj` is called with argument `obj` missing
//       fields `params` and `method`.





// Variable arguments ////////////////////
/*
 * Foreach arg in arguments:
 *   Add arg to a variable sum, initialized to zero
 * Return sum
 *
 * @var_args :: primitives
 * @return :: primitive
 */
function sum() {
  var sum = 0
  for (var i = 0, len = arguments.length; i < len; i++) {
    sum += arguments[i]
  }

  return sum
}

