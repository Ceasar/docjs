
# doc.js

doc.js is a tool for generating program specifications from Javascript source code.

# Setup

# Usage

Given a program, `examples/cucumber.js`:

```
// cucumber.js

/*
 * A long, green-skinned fruit with watery flesh, usually eaten raw in salads
 * or pickled.
 */
var Cucumber = function(color, length) {
    this.color = color;
    this.length = length;
}

/*
 * Cut a cucumber in half.
 */
var cutInHalf = function (cucumber) {
    return [
        new Cucumber(cucumber.color, cucumber.length / 2),
        new Cucumber(cucumber.color, cucumber.length / 2),
    ];
}
```

doc.js can produce a formal specification:

```
/*
 * Cut a cucumber in half.
 *
 * @pre
 *   cucumber :: Cucumber
 * @post
 *   return :: [Cucumber]
 *   return.length == 2
 *   for cuke in return
 *       cuke.color == return.color
 *       cuke.length == return.length / 2
 *   end
 */
```

Or, doc.js can produce an informal specification:

```
/*
 * Cut a cucumber in half.
 *
 * Given a Cucumber that is length N and color C
 * When I cutInHalf
 * Then I have 2 Cucumbers
 * And they are length N/2 and color C
 */
```
