(function() {
  var ASTConverter;

  ASTConverter = (function() {
    function ASTConverter(ast) {
      this.ast = ast;
    }

    ASTConverter.prototype.convertSwitchToIf = function(node, index, obj) {
      var i, if_node, last_if, parent_if, switchCase, _i, _len, _ref, _results;
      parent_if = last_if = {};
      _ref = node.cases;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        switchCase = _ref[i];
        if (if_node.test.right !== 'default') {
          if_node = {
            type: 'IfStatement',
            start: switchCase.start,
            end: switchCase.end,
            test: {
              type: 'BinaryExpression',
              start: 0,
              end: 0,
              left: node.discriminant,
              operator: '===',
              right: switchCase.test,
              consequent: switchCase.consequent
            }
          };
        } else {
          if_node = {
            type: 'BlockStatement',
            start: switchCase.start,
            end: switchCase.end,
            body: consequent
          };
        }
        if (i === 0) {
          parent_if = if_node;
        } else {
          parent_if.alternate = if_node;
        }
        _results.push(last_if = if_node);
      }
      return _results;
    };

    ASTConverter.prototype.convertForToWhile = function(node, index, obj) {
      var while_node;
      while_node = {
        type: "WhileStatement",
        start: node.start,
        end: node.end,
        test: test,
        body: body
      };
      while_node.body.body.push(node.update);
      return obj.body.slice(index, 0, node.init);
    };

    ASTConverter.prototype.convertDoWhileToWhile = function(node, index, obj) {};

    ASTConverter.prototype.convertTernaryToIf = function(node, index, obj) {};

    ASTConverter.prototype.rebuildAST = function(stringifiedAST) {
      var index, node, obj, _i, _len, _ref, _results;
      obj = JSON.parse(stringifiedAST);
      _ref = obj.body;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        node = _ref[index];
        if (node.type === 'ForStatement') {
          convertForToWhile(node, index, obj);
        }
        if (node.type === 'SwitchStatement') {
          _results.push(convertSwitchToIf(node, index, obj));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return ASTConverter;

  })();

}).call(this);
