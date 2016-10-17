window.Storage = function(KEY, setValue) {
	KEY = KEY.toUpperCase();
	if(window.localStorage != undefined) {
  	var getValue = null;

  	var CODE = (function() {
  		var CLIENT_STATE = (/CLIENT_STATE=(.*?)(;|$)/g.exec(document.cookie) || [])[1];
			if(window.localStorage && CLIENT_STATE) { return '<<-'+CLIENT_STATE; } else { return ''; }
		})();

    if(typeof setValue == 'undefined') {
      getValue = window.localStorage.getItem(KEY+CODE);
      try {
      	getValue = JSON.parse(getValue); 
      } catch(e) {
    		if(!getValue) getValue = {};
      }  
    } else {
      window.localStorage.setItem(KEY+CODE, (typeof setValue == "object" ? JSON.stringify(setValue) : setValue));
    }
  	return getValue || {};
	}
}