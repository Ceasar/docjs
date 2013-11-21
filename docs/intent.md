

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
