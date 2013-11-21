

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
