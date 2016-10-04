/*!
ver 0.9 2014-04-26 
 * initial version
ver 0.9.5 2014-04-28
 * focus loop grouping logic refactored
 * add options to enableTab()
 * add "enterKey" option to capture tab keydown event, prevent focus from going out of container
var 0.9.6 2015-04-01
 * add: simulate shift-tab reverse order behavior. [thanks for alannick's feedback]
var 1.0 2016-1004
 * change optional tabkey to enterkey 
 * add callback function after keytab or keyenter
*/
 
(function () {
    function focusPrev(pool, cb) {
        var a = document.activeElement;
        if (!a || pool.index(a) == -1) {
            var e = pool.first().focus();
            cb(parseInt(e.attr('tabindex')), e);
            return;
        }

        var currIdx = pool.index(a);
        if (currIdx > 0) {
            var e = pool.eq(currIdx - 1).focus();
            cb(parseInt(e.attr('tabindex')), e);
        } else {
            var e = pool.last().focus();
            cb(parseInt(e.attr('tabindex')), e);
        }
    };
    function focusNext(pool, cb) {
        var a = document.activeElement;
        if (!a || pool.index(a) == -1) {
            var e = pool.first().focus();
            cb(parseInt(e.attr('tabindex')), e);
            return;
        }

        var currIdx = pool.index(a);
        if (currIdx < pool.length - 1) {
            var e = pool.eq(currIdx + 1).focus();
            cb(parseInt(e.attr('tabindex')), e);
        } else { 
            var e = pool.first().focus(); 
            cb(parseInt(e.attr('tabindex')), e);
        }
    };
    var INPUT_SELECTOR = "input,select,textarea,button", IGNORE_CSS = "tab-ignore";
    jQuery.fn.getFocusCandidates = function (tabRange) {
        console.log('filter');
        return this.find(INPUT_SELECTOR).filter("[tabindex]:not([tabindex=-1])")
      //ignore disabled, readonly or invisible inputs
      .filter(
                ":not([disabled]):not([readonly]):visible" +
                //for enter key, tab-ignore fields are excluded
                //for tab key, they are included
                (tabRange ? "" : ":not(." + IGNORE_CSS + ")")
            )
      //order by tabindex
      .sort(function (a, b) { return a.tabIndex > b.tabIndex ? 1 : -1; });
    };
    var CONTAINER_CSS = "tab-container", ACTIVE_CSS = "tab-active";
    jQuery.fn.enableTab = function (options, callback) {
        var settings = $.extend({
            //let ya-enter2tab control tab key behavior, prevent focus going outside of the container
            enterKey: false 
        }, options);
        return this.each(function () {
            var $container = $(this);
            $container.addClass(CONTAINER_CSS)
            .on("keydown", "[tabindex]:not(textarea)", function (e) {
                var isTab = e.which == 9, isRevTab = isTab && e.shiftKey;
                var isEnter = e.which == 13;
                var $fld = $(this);
                var isIgnore = $fld.is(".tab-ignore"), isKeyOff = $fld.is(".tab-keyoff");

                if (isEnter && (isIgnore || isKeyOff)) return;
                if (isTab || (settings.enterKey && isEnter)) {
                  e.preventDefault();
                  var elem = $container.getFocusCandidates(isTab);
                  if (isRevTab) focusPrev(elem, callback); else focusNext(elem, callback);
                }
            });
        });
    };

})(jQuery);