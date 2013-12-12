{
    "type": "Program",
    "start": 0,
    "end": 51,
    "body": [
        {
            "type": "VariableDeclaration",
            "start": 0,
            "end": 12,
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "start": 4,
                    "end": 11,
                    "id": {
                        "type": "Identifier",
                        "start": 4,
                        "end": 7,
                        "name": "sum"
                    },
                    "init": {
                        "type": "Literal",
                        "start": 10,
                        "end": 11,
                        "value": 0,
                        "raw": "0"
                    }
                }
            ],
            "kind": "var"
        },
        {
            "type": "ForStatement",
            "start": 13,
            "end": 51,
            "init": {
                "type": "VariableDeclaration",
                "start": 17,
                "end": 24,
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "start": 21,
                        "end": 24,
                        "id": {
                            "type": "Identifier",
                            "start": 21,
                            "end": 22,
                            "name": "i"
                        },
                        "init": {
                            "type": "Literal",
                            "start": 23,
                            "end": 24,
                            "value": 0,
                            "raw": "0"
                        }
                    }
                ],
                "kind": "var"
            },
            "test": {
                "type": "BinaryExpression",
                "start": 26,
                "end": 32,
                "left": {
                    "type": "Identifier",
                    "start": 26,
                    "end": 27,
                    "name": "i"
                },
                "operator": "<",
                "right": {
                    "type": "Literal",
                    "start": 30,
                    "end": 32,
                    "value": 10,
                    "raw": "10"
                }
            },
            "update": {
                "type": "UpdateExpression",
                "start": 34,
                "end": 37,
                "operator": "++",
                "prefix": false,
                "argument": {
                    "type": "Identifier",
                    "start": 34,
                    "end": 35,
                    "name": "i"
                }
            },
            "body": {
                "type": "BlockStatement",
                "start": 39,
                "end": 51,
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "start": 43,
                        "end": 49,
                        "expression": {
                            "type": "UpdateExpression",
                            "start": 43,
                            "end": 48,
                            "operator": "++",
                            "prefix": false,
                            "argument": {
                                "type": "Identifier",
                                "start": 43,
                                "end": 46,
                                "name": "sum"
                            }
                        }
                    }
                ]
            }
        }
    ]
}
