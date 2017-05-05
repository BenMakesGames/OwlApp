(function($) {

    function OwlApp()
    {
        var _this = this;
     
        var apps = []; // we actually never use this... maybe in a later version??
        var listeners = {};
     
        // if you want your app to dispatch an event for other apps to listen to, have your app call
        // app.dispatch, passing the name of the event and an object containing all the args. ex:
        //     app.dispatch('flash', { message: 'This is a test. This is only a test.' });
        this.dispatch = function(event, args)
        {
            if(listeners.hasOwnProperty(event))
            {
                listeners[event].forEach(function(listener) {
                    listener(args);
                });
            }
        };
     
        // if you want your app to respond to events dispatched by other apps, have your app call
        // app.attachListener, passing the name of the event to listen for, and the function to handle
        // that event. when the named event is dispatched, the function will be called, and be passed
        // an object as its first (and only) argument. ex:
        //     app.attachListener('flash', function(args) { alert(args.message); })
        this.attachListener = function(event, callback)
        {
            if(!listeners.hasOwnProperty(event))
                listeners[event] = [];
     
            listeners[event].push(callback);
        };
     
        $('[data-owl]').each(function(i, element) {
            var $element = $(element);
            var appName = $element.attr('data-owl');
            var app;
     
            // instantiate new app
            try {
                app = new window['OwlApp' + appName](_this, $element);
            }
            catch(e)
            {
                console.log('Error while initializing OwlApp "' + appName + '":');
                console.log(e);
            }
     
            if(app)
            {
                // I can't help but think that there must be a better way to do this...
                [
                    'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup', 'wheel',
                    'keydown', 'keypress', 'keyup',
                    'touchcancel', 'touchend', 'touchmove', 'touchstart',
                    'animationend', 'animationiteration', 'animationstart', 'transitionend',
                    'abort', 'beforeunload', 'error', 'hashchange', 'load', 'pageshow', 'pagehide', 'resize', 'scroll', 'unload',
                    'blur', 'change', 'focus', 'focusin', 'focusout', 'input', 'invalid', 'reset', 'search', 'select', 'submit',
                    'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
                    'copy', 'cut', 'paste',
                    'afterprint', 'beforeprint',
                    'message', 'open', 'online', 'offline', 'popstate', 'storage',
                    'show', 'toggle',
                ].forEach(function(event) {
                    var dataAttr = 'data-owl-' + event;
     
                    // find any children who are listening for this event
                    $element.find('[' + dataAttr + ']').each(function(i, e) {
                        var $e = $(e);
                        $e.on(event, app[$e.attr(dataAttr)]);
                    });
     
                    // don't forget to check yo'self!
                    if($element.is('[' + dataAttr + ']'))
                    {
                        $element.on(event, app[$element.attr(dataAttr)]);
                    }
                });
     
                apps.push(app);
            }
        });
     
        return this;
    }
     
    $(function() {
        new OwlApp();
    });

})(jQuery);