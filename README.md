# doc.js

doc.js is a tool for generating program specifications from JavaScript source code.

# Setup
Running the project requires `node` and `npm` to be installed.

- `npm install` in the root directory
- `node build/somefile.js` to run parts of the project

Development requires `grunt-cli` to be installed.

- Running `grunt` in the root directory will watch for changes & compile
  Coffeescript source code from src/ to the build/ directory
- JS source code examples for analysis are included in the examples/ dir

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
 *   for x in return
 *       x.color == cucumber.color
 *       x.length == cucumber.length / 2
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
