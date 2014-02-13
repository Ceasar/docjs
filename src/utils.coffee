###
# Call a Node-style async function and return a promise.
#
# @param {function} fn A function that accepts a Node-style callback.
# @param {...*} var_args A variable number of arguments to pass to the Node function.
# @return {Promise}
###
q = (fn, args...) -> new Promise (resolve, reject) ->
  cb = (err, var_args...) ->
    if (err)
      reject(err)
    else if (var_args.length > 1)
      resolve(Array::slice.call(var_args))
    else
      resolve(var_args[0])

  args.push(cb)
  fn.apply(fn, args)
