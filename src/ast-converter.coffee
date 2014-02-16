class ASTConverter
  constructor: (@ast) ->

  convertSwitchToIf: (node, index, obj) ->
    parent_if = last_if = {}  # array of if else if nodes
    for switchCase, i in node.cases

      # check the default case.
      unless if_node.test.right == 'default'
        if_node =
          type: 'IfStatement'
          start: switchCase.start
          end: switchCase.end
          test:
            type: 'BinaryExpression'  # always check as ===
            start: 0
            end: 0    # TODO: how to determine start and end?
            left: node.discriminant
            operator: '==='
            right: switchCase.test
            consequent: switchCase.consequent
      else
        if_node =
          type: 'BlockStatement'
          start: switchCase.start
          end: switchCase.end
          body: consequent

      if i == 0 then parent_if = if_node else parent_if.alternate = if_node
      last_if = if_node


  convertForToWhile: (node, index, obj) ->
      # build while statement
      while_node =
        type: "WhileStatement"
        start: node.start
        end: node.end
        test: test
        body: body
      # append the update to the end of the body
      while_node.body.body.push node.update
      # append the init into obj.body before the while node.
      obj.body.slice index, 0, node.init

  convertDoWhileToWhile: (node, index, obj) ->

  convertTernaryToIf: (node, index, obj) ->

  rebuildAST: (stringifiedAST) ->
    obj = JSON.parse(stringifiedAST)
    for node, index in obj.body
      # console.log key, value
      if node.type == 'ForStatement'
        convertForToWhile node, index, obj
      if node.type == 'SwitchStatement'
        convertSwitchToIf node, index, obj


