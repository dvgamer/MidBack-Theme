// window.Exception = null;
window.CallbackException = function(m1, m2) {
	try { m1.getItems = JSON.parse(m1.getItems); } catch(ex) { m1 = m1 || {}; }
  this.err = m1.err == false ? false : true;
  this.title = m1.title || (m2!=undefined ? m1 : "Exception");
  this.msg = m1.msg || m2 || "";
  this.data = m1.getItems || {};
  this.toString = function(){ return this.title + ' >>> ' + this.msg; }

  // this.throw = function(){
  // 	if(!window.Exception) {
  // 		console.error(this.toString());
  // 	} else {
  // 		window.Exception.options.request = m2 || {};
  // 		window.Exception.options.response = this.data;
  // 		window.Exception.exError = this.err;
  // 		window.Exception.exTitle = this.title;
  // 		window.Exception.exMessage = this.msg;
  // 	}
  // }
}