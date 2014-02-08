// User examlple ////////////////////
function User(name, email) {
  this.name = name
  this.email = email
}

User.prototype.emailHost = function () {
  return this.email.split('@')[1]
}

function sendEmail(user) {
  console.log('Sending email to ' + user.name + ' (' + user.emailHost() + ')')
}


// Obj example ////////////////////
function createObj(method, path) {
  return {
    timestamp: Date.now(),
    method: method,
    path: path,
    params: {}
  }
}

function logObj(req) {
  var secondsAgo = Date.now() - req.timestamp
  console.log('[' + secondsAgo + ' ago] ' + req.method + ' ' + req.path +
              ' ' + JSON.stringify(req.params))
}

var req1 = createObj('GET', '/foo')
req1.params['param1'] = 'value1'
logObj(req1)

var req2 = createObj('POST', '/bar')
req2.params['name'] = 'Bob'
req2.headers['Content-Type'] = 'application/json'
logObj(req2)

logObj({timestamp: Date.now(), path: '/baz'})


// Variable arguments ////////////////////
function sum() {
  var sum = 0
  for (var i = 0, len = arguments.length; i < len; i++) {
    sum += arguments[i]
  }

  return sum
}

