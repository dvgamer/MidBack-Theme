window.TitlePage = function(page){ document.title = (page?page+' • ':'Travox ') + 'Midback Office™' }

$(function(){
	window.onbeforeunload = function(e) {
	  var e = e || window.event;
		e.defaultPrevented = true;
	  if(__.unload) {
	    if (e) e.returnValue = 'You want leaving the page';
	    return 'You want leaving the page';
	  }
	}
	// $(document).on("keydown", function(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); });

  var checkNotify = setInterval(function() {
  	var noti = {

  	}
    if (!("Notification" in window)) {
      new Notification("Hi there!", noti);
    } else if (Notification.permission === "granted") {
      clearInterval(checkNotify);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) Notification.permission = permission;
        if (permission !== "granted") {
      		new Notification("Hi there!", noti);
        } else {
          clearInterval(checkNotify);
        }
      });
    }
  }, 100);

  window.preloader = new $.materialPreloader({
    position: 'top',
    height: '4px',
    col_1: '#159756',
    col_2: '#da4733',
    col_3: '#3b78e7',
    col_4: '#fdba2c',
    fadeIn: 250,
    fadeOut: 250
  });
  preloader.on();
  setTimeout(function(){ preloader.off(); }, 400)

  $(window).capslockstate();

});