{
    "type": "Program",
    "start": 0,
    "end": 168,
    "body": [
        {
            "type": "IfStatement",
            "start": 0,
            "end": 168,
            "test": {
                "type": "BinaryExpression",
                "start": 3,
                "end": 12,
                "left": {
                    "type": "Identifier",
                    "start": 3,
                    "end": 6,
                    "name": "num"
                },
                "operator": "===",
                "right": {
                    "type": "Literal",
                    "start": 11,
                    "end": 12,
                    "value": 1,
                    "raw": "1"
                }
            },
            "consequent": {
                "type": "BlockStatement",
                "start": 14,
                "end": 39,
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "start": 18,
                        "end": 37,
                        "expression": {
                            "type": "CallExpression",
                            "start": 18,
                            "end": 36,
                            "callee": {
                                "type": "MemberExpression",
                                "start": 18,
                                "end": 29,
                                "object": {
                                    "type": "Identifier",
                                    "start": 18,
                                    "end": 25,
                                    "name": "console"
                                },
                                "property": {
                                    "type": "Identifier",
                                    "start": 26,
                                    "end": 29,
                                    "name": "log"
                                },
                                "computed": false
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "start": 30,
                                    "end": 35,
                                    "value": "one",
                                    "raw": "'one'"
                                }
                            ]
                        }
                    }
                ]
            },
            "alternate": {
                "type": "IfStatement",
                "start": 45,
                "end": 168,
                "test": {
                    "type": "BinaryExpression",
                    "start": 49,
                    "end": 58,
                    "left": {
                        "type": "Identifier",
                        "start": 49,
                        "end": 52,
                        "name": "num"
                    },
                    "operator": "===",
                    "right": {
                        "type": "Literal",
                        "start": 57,
                        "end": 58,
                        "value": 2,
                        "raw": "2"
                    }
                },
                "consequent": {
                    "type": "BlockStatement",
                    "start": 60,
                    "end": 85,
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "start": 64,
                            "end": 83,
                            "expression": {
                                "type": "CallExpression",
                                "start": 64,
                                "end": 82,
                                "callee": {
                                    "type": "MemberExpression",
                                    "start": 64,
                                    "end": 75,
                                    "object": {
                                        "type": "Identifier",
                                        "start": 64,
                                        "end": 71,
                                        "name": "console"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "start": 72,
                                        "end": 75,
                                        "name": "log"
                                    },
                                    "computed": false
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "start": 76,
                                        "end": 81,
                                        "value": "two",
                                        "raw": "'two'"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "alternate": {
                    "type": "IfStatement",
                    "start": 91,
                    "end": 168,
                    "test": {
                        "type": "BinaryExpression",
                        "start": 95,
                        "end": 104,
                        "left": {
                            "type": "Identifier",
                            "start": 95,
                            "end": 98,
                            "name": "num"
                        },
                        "operator": "===",
                        "right": {
                            "type": "Literal",
                            "start": 103,
                            "end": 104,
                            "value": 3,
                            "raw": "3"
                        }
                    },
                    "consequent": {
                        "type": "BlockStatement",
                        "start": 106,
                        "end": 133,
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "start": 110,
                                "end": 131,
                                "expression": {
                                    "type": "CallExpression",
                                    "start": 110,
                                    "end": 130,
                                    "callee": {
                                        "type": "MemberExpression",
                                        "start": 110,
                                        "end": 121,
                                        "object": {
                                            "type": "Identifier",
                                            "start": 110,
                                            "end": 117,
                                            "name": "console"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "start": 118,
                                            "end": 121,
                                            "name": "log"
                                        },
                                        "computed": false
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "start": 122,
                                            "end": 129,
                                            "value": "three",
                                            "raw": "'three'"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "alternate": {
                        "type": "BlockStatement",
                        "start": 139,
                        "end": 168,
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "start": 143,
                                "end": 166,
                                "expression": {
                                    "type": "CallExpression",
                                    "start": 143,
                                    "end": 165,
                                    "callee": {
                                        "type": "MemberExpression",
                                        "start": 143,
                                        "end": 154,
                                        "object": {
                                            "type": "Identifier",
                                            "start": 143,
                                            "end": 150,
                                            "name": "console"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "start": 151,
                                            "end": 154,
                                            "name": "log"
                                        },
                                        "computed": false
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "start": 155,
                                            "end": 164,
                                            "value": "default",
                                            "raw": "'default'"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
    ]
}
