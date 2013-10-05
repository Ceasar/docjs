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
