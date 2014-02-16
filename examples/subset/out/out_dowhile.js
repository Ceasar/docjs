{
    "type": "Program",
    "start": 0,
    "end": 43,
    "body": [
        {
            "type": "ExpressionStatement",
            "start": 0,
            "end": 6,
            "expression": {
                "type": "AssignmentExpression",
                "start": 0,
                "end": 5,
                "operator": "=",
                "left": {
                    "type": "Identifier",
                    "start": 0,
                    "end": 1,
                    "name": "x"
                },
                "right": {
                    "type": "Literal",
                    "start": 4,
                    "end": 5,
                    "value": 0,
                    "raw": "0"
                }
            }
        },
        {
            "type": "DoWhileStatement",
            "start": 7,
            "end": 43,
            "body": {
                "type": "BlockStatement",
                "start": 10,
                "end": 29,
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "start": 14,
                        "end": 20,
                        "expression": {
                            "type": "AssignmentExpression",
                            "start": 14,
                            "end": 19,
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "start": 14,
                                "end": 15,
                                "name": "y"
                            },
                            "right": {
                                "type": "Literal",
                                "start": 18,
                                "end": 19,
                                "value": 2,
                                "raw": "2"
                            }
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "start": 23,
                        "end": 27,
                        "expression": {
                            "type": "UpdateExpression",
                            "start": 23,
                            "end": 26,
                            "operator": "++",
                            "prefix": false,
                            "argument": {
                                "type": "Identifier",
                                "start": 23,
                                "end": 24,
                                "name": "x"
                            }
                        }
                    }
                ]
            },
            "test": {
                "type": "BinaryExpression",
                "start": 36,
                "end": 41,
                "left": {
                    "type": "Identifier",
                    "start": 36,
                    "end": 37,
                    "name": "x"
                },
                "operator": "<",
                "right": {
                    "type": "Literal",
                    "start": 40,
                    "end": 41,
                    "value": 5,
                    "raw": "5"
                }
            }
        }
    ]
}