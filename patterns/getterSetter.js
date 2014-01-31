// Traditional getter/setter pattern

var myObj = {

  _val: 0,

  val: function (newVal) {
    if (newVal) {
      this._val = newVal
    }
    return this._val
  }
}
