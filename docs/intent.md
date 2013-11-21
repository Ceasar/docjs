

Intention & Programming Languages
=================================

An intention is an agent's specific purpose in performing an action or series of action; the end or goal that is aimed at. Intention differs from or unanticipated outcomes, unintended consequences.

Occasionally, programming languages cannot express a programmer's intent in a clear and concise manner. This problem is so notorious in certain languages that it has a name: Greenspun's Tenth Rule.

> Any sufficiently complicated C or Fortran program contains an ad hoc informally-specified bug-ridden slow implementation of half of Common Lisp.
>
> If you try to solve a hard problem, the question is not whether you will use a powerful enough language, but whether you will (a) use a powerful language, (b) write a de facto interpreter for one, or (c) yourself become a human compiler for one. We see this already beginning to happen in the Python example, where we are in effect simulating the code that a compiler would generate to implement a lexical variable.
>
> This practice is not only common, but institutionalized. For example, in the OO world you hear a good deal about “patterns.” I wonder if these patterns are not sometimes evidence of case (c), the human compiler, at work. 8 When I see patterns in my programs, I consider it a sign of trouble. The shape of a program should reflect only the problem it needs to solve. Any other regularity in the code is a sign, to me at least, that I’m using abstractions that aren’t powerful enough — often that I’m generating by hand the expansions of some macro that I need to write.

Note the last part about design patterns.

Catalog
=======

The following is a catalog of code that fails to express clearly and concisely express intent.

Magic number
------------

A magic number is a literal value that appears in a program.

```
total = 1.08 * price
```

Magic numbers should be replaced by named constants to make the intention clear.

```
TAX_RATE_IN_TEXAS = 1.08
total = TAX_RATE_IN_TEXAS * price
```

This is especially true when the same literal value means different things.

Bad:

```
total = 1.08 * 1.08 * price
```

```
USE_TAX = 1.08
SALES_TAX = 1.08
total = USE_TAX * SALES_TAX * price
```

Practically, replacing magic numbers with named constants has several advantages:

- Unlike a magic number, a named constant can be reliably searched and replaced.
- If the value of a magic number changes, then every location in which it appears needs to be updated. In contrast, if the value of a named constant changes, then a single location (the declaration) needs to be updated.

Non-semantic name
-----------------

A semantic name describes _what_ it represents without identifying any inessential attributes.

For instance, in CSS it often happens that a certain div should be on the left side of the screen and another on the right side of the screen, and classes are often named to reflect that.

```
.left-part {
    float: left;
    color: red;
}
.right-part {
    float: right;
    color: blue;
}
```

However, this commits `.left-part` to always be on the left or risks the possibility that `.left-part` comes to mean something entirely unrelated, if for instance its decided that it should on the right side of the screen.

A clearer way to name classes in CSS is to name them after what they represent. For instance, we might have:

```
.article {
    float: left;
    color: red;
}
.side-bar {
    float: right;
    color: blue;
}
```

Now, should any property change for either `.article` or `.side-bar`, the name will not be confusing.

In general purpose programming languages, this mistake usually manifest by referring to form rather than content. For instance:

```
# get a tweet in JSON form
json = twitter.get_tweet()
print json
```

Similar to the CSS case, if the form of the data changes, the code no longer makes sense. It would be more clear to refer to the object rather than its form as in:

```
# get a tweet in JSON form
tweet = twitter.get_tweet()
print tweet
```

Regex
-----

Few people are so familiar with regexes that they are highly discouraged. It is almost always more readable to encapsulate them in something which expresses their intent clearly.

Bad:

```
>>> import re
>>> pattern = re.compile('^red')
>>> pattern.match("blue")
False
>>> pattern.match("reds")
True
```

Good:

```
>>> "reds".startswith("red")
```

Often, regexes need to be extensively documented:

Bad:

```
charref = re.compile("&#(0[0-7]+"
                     "|[0-9]+"
                     "|x[0-9a-fA-F]+);")
```

Good:

```
charref = re.compile(r"""
 &[#]                # Start of a numeric entity reference
 (
     0[0-7]+         # Octal form
   | [0-9]+          # Decimal form
   | x[0-9a-fA-F]+   # Hexadecimal form
 )
 ;                   # Trailing semicolon
""", re.VERBOSE)
```

Recursion vs. Iteration
-----------------------

If we consider intent alone, many algorithms are far more clearly expressed as recursive algorithms rather than 

For instance:


```
def fib(n):
    return n if n in (0, 1) else fib(n-1) + fib(n-2)
```

```
def _fib_x(call_stack, rv, f):
    if len(call_stack) == 0:
        yield rv
    else:
        n = call_stack.pop()
        if n in (0, 1):
            yield _fib_x(call_stack, f(rv, n), f)
        else:
            call_stack.append(n - 1)
            call_stack.append(n - 2)
            yield _fib_x(call_stack, rv, f)
```

Some recursive algorithms are nearly impossible to translate mechanically into an iterative form without serious training:

```
def ackermann(x, y):
    return ackermann(x, ackermann(x, y - 1))
```

Builder Pattern
---------------

```
public static class Builder {
    // required parameters
    private final int servingSize;
    private final int servings;

    // optional parameters
    private int calories = 0;
    private int fat = 0;
    private int carbohydrate = 0;
    private int sodium = 0;

    private Builder (int servingSize, int servings) {
        this.servingSize = servingSize;
        this.servings = servings;
    }

    public Builder calories(int val) {
        calories = val;
        return this;
    }

    public Builder fat(int val) {
        fat = val;
        return this;
    }

    public Builder carbohydrate(int val) {
        carbohydrate = val;
        return this;
    }

    public Builder sodium(int val) {
        sodium = val;
        return this;
    }

    public  NutritionFacts build() {
        return new NutritionFacts(this);
    }

    private NutritionFacts(Builder builder) {
        servingSize = builder.servingSize;
        servings = builder.servings;
        calories = builder.calories;
        fat = builder.fat;
        sodium = builder.sodium;
        carbohydrate = builder.carbohydrate;
    }
}
```

```
class NutritionFacts(object):
    def __init__(self, serving_size, servings, calories=0, fat=0, sodium=0, carbohydrate=0):
        self.serving_size = serving_size
        self.servings = servings
        self.calories = calories
        self.fat = fat
        self.sodium = sodium
        self.carbohydrate = carbohydrate
```

namedtuple (python)
-------------------

```
################################################################################
### namedtuple
################################################################################

_class_template = '''\
class {typename}(tuple):
    '{typename}({arg_list})'

    __slots__ = ()

    _fields = {field_names!r}

    def __new__(_cls, {arg_list}):
        'Create new instance of {typename}({arg_list})'
        return _tuple.__new__(_cls, ({arg_list}))

    @classmethod
    def _make(cls, iterable, new=tuple.__new__, len=len):
        'Make a new {typename} object from a sequence or iterable'
        result = new(cls, iterable)
        if len(result) != {num_fields:d}:
            raise TypeError('Expected {num_fields:d} arguments, got %d' % len(result))
        return result

    def __repr__(self):
        'Return a nicely formatted representation string'
        return '{typename}({repr_fmt})' % self

    def _asdict(self):
        'Return a new OrderedDict which maps field names to their values'
        return OrderedDict(zip(self._fields, self))

    def _replace(_self, **kwds):
        'Return a new {typename} object replacing specified fields with new values'
        result = _self._make(map(kwds.pop, {field_names!r}, _self))
        if kwds:
            raise ValueError('Got unexpected field names: %r' % kwds.keys())
        return result

    def __getnewargs__(self):
        'Return self as a plain tuple.  Used by copy and pickle.'
        return tuple(self)

    __dict__ = _property(_asdict)

    def __getstate__(self):
        'Exclude the OrderedDict from pickling'
        pass

{field_defs}
'''

_repr_template = '{name}=%r'

_field_template = '''\
    {name} = _property(_itemgetter({index:d}), doc='Alias for field number {index:d}')
'''

def namedtuple(typename, field_names, verbose=False, rename=False):
    """Returns a new subclass of tuple with named fields.

    >>> Point = namedtuple('Point', ['x', 'y'])
    >>> Point.__doc__                   # docstring for the new class
    'Point(x, y)'
    >>> p = Point(11, y=22)             # instantiate with positional args or keywords
    >>> p[0] + p[1]                     # indexable like a plain tuple
    33
    >>> x, y = p                        # unpack like a regular tuple
    >>> x, y
    (11, 22)
    >>> p.x + p.y                       # fields also accessable by name
    33
    >>> d = p._asdict()                 # convert to a dictionary
    >>> d['x']
    11
    >>> Point(**d)                      # convert from a dictionary
    Point(x=11, y=22)
    >>> p._replace(x=100)               # _replace() is like str.replace() but targets named fields
    Point(x=100, y=22)

    """

    # Validate the field names.  At the user's option, either generate an error
    # message or automatically replace the field name with a valid name.
    if isinstance(field_names, basestring):
        field_names = field_names.replace(',', ' ').split()
    field_names = map(str, field_names)
    if rename:
        seen = set()
        for index, name in enumerate(field_names):
            if (not all(c.isalnum() or c=='_' for c in name)
                or _iskeyword(name)
                or not name
                or name[0].isdigit()
                or name.startswith('_')
                or name in seen):
                field_names[index] = '_%d' % index
            seen.add(name)
    for name in [typename] + field_names:
        if not all(c.isalnum() or c=='_' for c in name):
            raise ValueError('Type names and field names can only contain '
                             'alphanumeric characters and underscores: %r' % name)
        if _iskeyword(name):
            raise ValueError('Type names and field names cannot be a '
                             'keyword: %r' % name)
        if name[0].isdigit():
            raise ValueError('Type names and field names cannot start with '
                             'a number: %r' % name)
    seen = set()
    for name in field_names:
        if name.startswith('_') and not rename:
            raise ValueError('Field names cannot start with an underscore: '
                             '%r' % name)
        if name in seen:
            raise ValueError('Encountered duplicate field name: %r' % name)
        seen.add(name)

    # Fill-in the class template
    class_definition = _class_template.format(
        typename = typename,
        field_names = tuple(field_names),
        num_fields = len(field_names),
        arg_list = repr(tuple(field_names)).replace("'", "")[1:-1],
        repr_fmt = ', '.join(_repr_template.format(name=name)
                             for name in field_names),
        field_defs = '\n'.join(_field_template.format(index=index, name=name)
                               for index, name in enumerate(field_names))
    )
    if verbose:
        print class_definition

    # Execute the template string in a temporary namespace and support
    # tracing utilities by setting a value for frame.f_globals['__name__']
    namespace = dict(_itemgetter=_itemgetter, __name__='namedtuple_%s' % typename,
                     OrderedDict=OrderedDict, _property=property, _tuple=tuple)
    try:
        exec class_definition in namespace
    except SyntaxError as e:
        raise SyntaxError(e.message + ':\n' + class_definition)
    result = namespace[typename]

    # For pickling to work, the __module__ variable needs to be set to the frame
    # where the named tuple is created.  Bypass this step in environments where
    # sys._getframe is not defined (Jython for example) or sys._getframe is not
    # defined for arguments greater than 0 (IronPython).
    try:
        result.__module__ = _sys._getframe(1).f_globals.get('__name__', '__main__')
    except (AttributeError, ValueError):
        pass

    return result
```
