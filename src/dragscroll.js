// ==UserScript==
// @name Drag scroll
// @author Nicolas Mendoza <nicolasm@opera.com>
// @namespace http://people.opera.com/nicolasm/
// @version 1.0
// @license Poetic license: http://genaud.net/2005/10/poetic-license/
// @description Let's you drag a page around with mouse
// @ujs:category general: enhancements
// @ujs:published 2005-05-24 12:30
// @ujs:modified 2007-05-24 14:17
// @ujs:documentation http://people.opera.com/nicolasm/userjs/dragscroll
// @ujs:download http://people.opera.com/nicolasm/userjs/dragscroll.js
// ==/UserScript==

window.addEventListener("load",function() {

  var dragModifier = "shiftKey";

  var dragging = false;

  var timeoutId = 0;
  
  document.addEventListener("mousedown",startDragScroll,false);
  
  document.addEventListener("mouseup",stopDragScroll,false);

  document.addEventListener("mousemove",dragScroll,false);

  function startDragScroll(e){
      if (timeoutId) { window.clearTimeout(timeoutId); }
      dragging=e;
  }

  function stopDragScroll(e){ 
    dragging=false;
  }

  function dragScroll(e) {
    if (dragging) {
      window.scrollBy((dragging.clientX-e.clientX),(dragging.clientY-e.clientY));
      dragging = e;
      e.preventDefault();
      e.stopPropagation();
      if (timeoutId) { window.clearTimeout(timeoutId); }      
      timeoutId = window.setTimeout(stopDragScroll,100);
    }
  }
},false);
