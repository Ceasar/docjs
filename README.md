
# doc.js

doc.js is a tool for generating program specifications from Javascript source code.

# Setup

# Usage

Given the program:

```
# Cut a cucumber in half.
cutInHalf = (cucumber) ->
    return [
        new Cucumber(cucumber.color, cucumber.length / 2),
        new Cucumber(cucumber.color, cucumber.length / 2),
    ]
```

doc.js can produce a formal specification:

```
# Cut a cucumber in half.
#
# @pre
#   cucumber :: Cucumber
# @post
#   return :: [Cucumber]
#   return.length == 2
#   for cuke in return
#       cuke.color == return.color
#       cuke.length == return.length / 2
#   end
cutInHalf = (cucumber) -> ...
```

doc.js can produce an informal specification:

```
# Given a Cucumber that is length N and color C
# When I cut it in half
# Then I have 2 Cucumbers
# And both are length N/2 and color C
#
# @param Cucumber
# @return [Cucumber]
cutInHalf = (cucumber) -> ...
```
