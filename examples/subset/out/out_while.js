{
    "type": "Program",
    "start": 0,
    "end": 87,
    "body": [
        {
            "type": "VariableDeclaration",
            "start": 0,
            "end": 20,
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "start": 4,
                    "end": 19,
                    "id": {
                        "type": "Identifier",
                        "start": 4,
                        "end": 15,
                        "name": "while_count"
                    },
                    "init": {
                        "type": "Literal",
                        "start": 18,
                        "end": 19,
                        "value": 0,
                        "raw": "0"
                    }
                }
            ],
            "kind": "var"
        },
        {
            "type": "VariableDeclaration",
            "start": 21,
            "end": 33,
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "start": 25,
                    "end": 32,
                    "id": {
                        "type": "Identifier",
                        "start": 25,
                        "end": 28,
                        "name": "sum"
                    },
                    "init": {
                        "type": "Literal",
                        "start": 31,
                        "end": 32,
                        "value": 0,
                        "raw": "0"
                    }
                }
            ],
            "kind": "var"
        },
        {
            "type": "WhileStatement",
            "start": 34,
            "end": 87,
            "test": {
                "type": "BinaryExpression",
                "start": 40,
                "end": 56,
                "left": {
                    "type": "Identifier",
                    "start": 40,
                    "end": 51,
                    "name": "while_count"
                },
                "operator": "<",
                "right": {
                    "type": "Literal",
                    "start": 54,
                    "end": 56,
                    "value": 10,
                    "raw": "10"
                }
            },
            "body": {
                "type": "BlockStatement",
                "start": 58,
                "end": 87,
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "start": 62,
                        "end": 68,
                        "expression": {
                            "type": "UpdateExpression",
                            "start": 62,
                            "end": 67,
                            "operator": "++",
                            "prefix": false,
                            "argument": {
                                "type": "Identifier",
                                "start": 62,
                                "end": 65,
                                "name": "sum"
                            }
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "start": 71,
                        "end": 85,
                        "expression": {
                            "type": "UpdateExpression",
                            "start": 71,
                            "end": 84,
                            "operator": "++",
                            "prefix": false,
                            "argument": {
                                "type": "Identifier",
                                "start": 71,
                                "end": 82,
                                "name": "while_count"
                            }
                        }
                    }
                ]
            }
        }
    ]
}