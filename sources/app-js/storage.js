window.Storage = function(KEY, setValue) {
	KEY = KEY.toUpperCase();
  // keyGlobal = keyGlobal || false;

	if(window.localStorage != undefined) {
  	var getValue = null;

  	var CODE = (function() {
			if(window.localStorage && MBOS.CLIENT()) { return '<<-'+MBOS.CLIENT(); } else { return ''; }
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