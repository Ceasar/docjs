// Collections
    /*
     *
     * Formal:
     * @param {Array} obj
     * @param {Function} iterator
     * @param {Context} context
     * @return
     * @invariant: obj.length == obj.length
     *
     * Informal:
     * each takes in an Array obj, a Function iterator, and a Context context.
     * If obj is null, the function returns.
     *** If nativeForEach exists, and obj's forEach is equivalent to nativeForEach, run forEach with iterator, context
     * Otherwise if obj.length is equivalent to +obj.length,
     *** For every obj[i] in obj,
     ****** If call iterator with the Context context and the parameters @obj[i], @i, and @obj is equivalent to breaker, return.
     * Otherwise
     *** Where keys is _.keys(obj)
     *** If call iterator with the Context context and the parameters @obj[keys[i]], keys[i], obj is equivalent to breaker, return.
     */
    var each = _.each = _.forEach = function(obj, iterator, context) {
      if (obj == null)
        // {{ obj == null }}
        return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        // {{ nativeForeach == obj.forEach }}
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        // {{ obj.length == +obj.length }}
        // {{ Z = 0 }}
        for (var i = 0, length = obj.length; i < length; i++) {
          // {{ i = Z + 1 }}
          // {{ i < array.length }}
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
          // {{ results.length }}
          // {{ Z = i + 1 }}
        }
      } else {
        // {{ obj.length !== +obj.length }}
        // {{ obj.forEach !== nativeForEach }}
        var keys = _.keys(obj);
        // {{ Z = 0 }}
        for (var i = 0, length = keys.length; i < length; i++) {
          // {{ i = Z + 1 }}
          // {{ i < length }}
          if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker)
            // {{ }}
            return;
          // {{ Z = i + 1 }}
        }
      }
    };

--

    /*
     * Formal:
     * @param {Array} obj
     * @param {Function} iterator
     * @param {Context} context
     * @return
     * @invariant: obj.length == obj.length
     *
     * Informal:
     * If obj is null, return results, an empty array. If nativeMap exists and obj.map is equivalent to nativeMap, return the result of obj.map(iterator, context).
     * Call each with @obj and an anonymous @Function taking in @value, @index, and @list.
     *** push onto results the result of calling the iterator on Context @context, @value, @index, and @list.
     *** return results
     */
    _.map = _.collect = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      each(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
      });
      return results;
    };

    var reduceError = 'Reduce of empty array with no initial value';


--

    /*
     * Formal:
     * @param {Array} obj
     * @param {Function} iterator
     * @param memo
     * @param {Context} context
     * @return
     * @invariant: obj.length == obj.length
     *
     * Informal:
     * If obj is null, return results, an empty array. If nativeMap exists and obj.map is equivalent to nativeMap, return the result of obj.map(iterator, context).
     * Call each with @obj and an anonymous @Function taking in @value, @index, and @list.
     *** push onto results the result of calling the iterator on Context @context, @value, @index, and @list.
     *** return results
     */

    _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
      var initial = arguments.length > 2;
      if (obj == null) obj = [];
      if (nativeReduce && obj.reduce === nativeReduce) {
        if (context) iterator = _.bind(iterator, context);
        return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
      }
      each(obj, function(value, index, list) {
        if (!initial) {
          memo = value;
          initial = true;
        } else {
          memo = iterator.call(context, memo, value, index, list);
        }
      });
      if (!initial) throw new TypeError(reduceError);
      return memo;
    };


--

    /*
     * Formal:
     * @param {Array} obj
     * @param {Function} iterator
     * @param {Context} context
     * @return
     * @invariant: obj.length == obj.length
     *
     * Informal:
     * Calling any on @obj given a Function taking in a @value, @index, and @list that:
     *** if call iterator with Context @context, passing it @value, @index, @list, set result to value, and return true.
     * Return @result
     */

    _.find = _.detect = function(obj, iterator, context) {
      var result;
      any(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) {
          result = value;
          return true;
        }
      });
      return result;
    };


// ARRAY FUNCTIONS

    /*
     * Formal:
     * @param {Array} array
     * @param {Function} n
     * @param {Context} guard
     * @return
     * @invariant: obj.length == obj.length
     *
     * Informal:
     * If @array is null, return undefined
     * Return the first element of @array if n is null or if guard exists, otherwise return the result of calling slice on Context @array, 0, @n
     */
    _.first = _.head = _.take = function(array, n, guard) {
      if (array == null)
        // {{ array == null }}
        return void 0;
      return (n == null) || guard ? array[0] : slice.call(array, 0, n);
    };

    /*
     * Formal:
     * @param {Array} array
     * @param {Function} n
     * @param {Context} guard
     * @return
     * @invariant: obj.length == obj.length
     *
     * Informal:
     * If @array is null, return undefined
     * If @n is null or guard exists, return array[array.length - 1].
     * Return the first element of @array if n is null or if guard exists, otherwise return the result of calling slice on Context @array, 0, @n
     *
     */
    _.last = function(array, n, guard) {
      if (array == null)
        // {{ array == null }}
        return void 0;
      if ((n == null) || guard) {
        // {{n == null \/ guard }}
        return array[array.length - 1];
      } else {
        // {{ array != null }}
        // {{ n != null }}
        // {{ !guard }}
        return slice.call(array, Math.max(array.length - n, 0));
      }
    };


    /*
     * Formal:
     * @param {Array} input
     * @param {Boolean} shallow
     * @param {Array} output
     * @return
     * @invariant: obj.length == obj.length
     *
     * Informal:
     * If @array is null, return undefined
     * If @n is null or guard exists, return array[array.length - 1].
     * Return the first element of @array if n is null or if guard exists, otherwise return the result of calling slice on Context @array, 0, @n
     *
     */
    var flatten = function(input, shallow, output) {
      {{ original = output }}
      if (shallow && _.every(input, _.isArray)) {
        {{ shallow }}
        {{ _.every(input, _.isArray) }}
        return concat.apply(output, input);
      }
      each(input, function(value) {
        if (_.isArray(value) || _.isArguments(value)) {
          {{ _.isArray(value) }}
          {{ _.isArguments(value) }}
          shallow ? push.apply(output, value) : flatten(value, shallow, output);
        } else {
          {{ !_.isArray(value) }}
          {{ !_.isArgument(value) }}
          output.push(value);
        }
      });
      {{ output.length == original.length }}
      return output;
    };

