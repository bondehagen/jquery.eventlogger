/*
* jquery eventlogger
*
* Copyright (c) 2011 Anders Bondehagen (anders@bondehagen.com)
* Licensed under the MIT license.
*
*/
(function() {

   var lastEventTime = new Date();
   var jQueryHandle = jQuery.event.handle;
   var jQueryAdd = jQuery.event.add;

   HTMLElement.prototype.html = function () {
      var a = this.attributes, str = "<" + this.tagName.toLowerCase();
      for (var i in a) if (a[i].specified)
         str += " " + a[i].name + '="' + a[i].value + '"';
      return str + " />";
   };

   function formatTime(time) {
      return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + ":" + time.getMilliseconds();
   }

   jQuery.event.add = function(elem, types, handler, data) {
      // Execute the original jQuery method.
      var ret = jQueryAdd.apply(this, arguments);

      console.groupCollapsed("Bind event: " + types);
      console.log("add: " + types + " elem " + elem.html());
      console.log(elem);
      console.log(handler.toSource());
      //console.trace();
      console.groupEnd();
      return ret;
   };

   jQuery.event.handle = function(event) {
      var currentTime = new Date();
      if ((currentTime - lastEventTime) > 500)
         console.log("________");
      lastEventTime = currentTime;

      console.groupCollapsed("Event: " + event.type);
      var elem = event.target;
      console.log(event.type + " " + elem.html() + " " + formatTime(currentTime));
      /*if (event.timeStamp) {
       console.groupCollapsed("Trace");
       console.trace();
       console.groupEnd();
       }*/

      var events = jQuery.data(this, this.nodeType ? "events" : "__events__");

      if (typeof events === "function") {
         events = events.events;
      }

      var handlers = (events || {})[ event.type ];

      if (events && handlers) {
         // Clone the handlers to prevent manipulation
         handlers = handlers.slice(0);

         for (var j = 0, l = handlers.length; j < l; j++) {
            console.log(handlers[j].handler.toSource());
         }
      }

      console.groupEnd();

      // Execute the original jQuery method.
      return jQueryHandle.apply(this, arguments);
   };

})();