

Intention
==========

An intention is an agent's specific purpose in performing an action or series of action; the end or goal that is aimed at.

Intention differs from unintended consequences, or unanticipated outcomes.

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
