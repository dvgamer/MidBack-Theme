// window.Exception = null;
window.CallbackException = function(res, msg) {
  _.defaults(res, {
    err: !msg ? true : false,
    title: !msg ? res : '',
    msg: msg || '',
    data: {}
  });
  _.defaults(this, res);
  this.toString = function(){ return this.title + ' >>> ' + this.msg; }
}