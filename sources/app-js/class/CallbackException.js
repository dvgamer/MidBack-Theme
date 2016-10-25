window.Exception = null;
window.CallbackException = function(m1, m2) {
	try { m1.getItems = JSON.parse(m1.getItems); } catch(ex) { m1 = m1 || {}; }
  this.exError = m1.exError == false ? false : true;
  this.exTitle = m1.exTitle || (m2!=undefined ? m1 : "Exception");
  this.exMessage = m1.exMessage || m2 || "";
  this.getItems = m1.getItems || {};
  this.toString = function(){ return this.exTitle + ' >>> ' + this.exMessage; }

  this.throw = function(){
  	if(!window.Exception) {
  		console.error(this.exTitle, this.exMessage);
  	} else {
  		window.Exception.options.request = m2 || {};
  		window.Exception.options.response = this.getItems;
  		window.Exception.exError = this.exError;
  		window.Exception.exTitle = this.exTitle;
  		window.Exception.exMessage = this.exMessage;
  	}

  }
}