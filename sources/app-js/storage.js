
window.Storage = function(KEY, setValue) {
	KEY = KEY.toUpperCase();
  // keyGlobal = keyGlobal || false;

	if(window.localStorage != undefined) {
  	var getValue = null;

  	// var CODE = (function() { if(window.localStorage && MBOS.CLIENT()) { return '<<-'+MBOS.CLIENT(); } else { return ''; } })();

    if(typeof setValue == 'undefined') {
      getValue = window.localStorage.getItem(KEY);
      try { getValue = JSON.parse(getValue); } catch(e) { }
    } else {
      window.localStorage.setItem(KEY, (typeof setValue == "object" ? JSON.stringify(setValue) : setValue));
    }
  	return getValue;
	}
}
window.RemoveStorage = function(KEY) {
  KEY = KEY.toUpperCase();
  if(window.localStorage != undefined) {
    // var CODE = (function() { if(window.localStorage && MBOS.CLIENT()) { return '<<-'+MBOS.CLIENT(); } else { return ''; } })();
    window.localStorage.removeItem(KEY);
  }
}