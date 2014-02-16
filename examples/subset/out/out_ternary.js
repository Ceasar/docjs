{
    "type": "Program",
    "start": 0,
    "end": 28,
    "body": [
        {
            "type": "VariableDeclaration",
            "start": 0,
            "end": 28,
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "start": 4,
                    "end": 27,
                    "id": {
                        "type": "Identifier",
                        "start": 4,
                        "end": 5,
                        "name": "a"
                    },
                    "init": {
                        "type": "ConditionalExpression",
                        "start": 8,
                        "end": 27,
                        "test": {
                            "type": "BinaryExpression",
                            "start": 8,
                            "end": 13,
                            "left": {
                                "type": "Literal",
                                "start": 8,
                                "end": 9,
                                "value": 7,
                                "raw": "7"
                            },
                            "operator": ">",
                            "right": {
                                "type": "Literal",
                                "start": 12,
                                "end": 13,
                                "value": 4,
                                "raw": "4"
                            }
                        },
                        "consequent": {
                            "type": "Literal",
                            "start": 16,
                            "end": 20,
                            "value": "hi",
                            "raw": "'hi'"
                        },
                        "alternate": {
                            "type": "Literal",
                            "start": 23,
                            "end": 27,
                            "value": "no",
                            "raw": "'no'"
                        }
                    }
                }
            ],
            "kind": "var"
        }
    ]
}