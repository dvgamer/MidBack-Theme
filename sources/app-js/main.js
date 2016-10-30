window.TitlePage = function(page){ document.title = (page?page+' • ':'Travox ') + 'Midback Office™' }
var cache_page = false;
cache.on('downloading', function(sender){
  preloader.on();
  cache_page = true;
});
cache.on('progress', function(sender){ 
  console.log(sender.loaded, sender.total); 
});
cache.on('cached', function(sender){ 
  if(cache_page) {
    preloader.off();
    cache_page = false;
  }
  cache.stop();
});

cache.on('noupdate', function(){ 
  console.log('Cache Installed.');
  cache.stop();
});

// cache.on('start', function(){ });
// cache.on('stop', function(){ });

cache.on('update', function(){ console.log('handleUpdate'); });
cache.on('error', function(){ console.log('handleError'); });
cache.on('obsolete', function(){ console.log('handleObsolete'); });
cache.on('updateready', function(){ console.log('handleUpdateready'); });


// plus some extra ones
cache.on('init:downloading', function(){ console.log('handleInitDownloading'); });
cache.on('init:progress', function(){ console.log('handleInitProgress'); });
cache.on('init:cached', function(){ console.log('handleInitCached'); });


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

  $(window).capslockstate();

});