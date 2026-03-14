"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/unpipe";
exports.ids = ["vendor-chunks/unpipe"];
exports.modules = {

/***/ "(api)/./backend/node_modules/unpipe/index.js":
/*!**********************************************!*\
  !*** ./backend/node_modules/unpipe/index.js ***!
  \**********************************************/
/***/ ((module) => {

eval("/*!\n * unpipe\n * Copyright(c) 2015 Douglas Christopher Wilson\n * MIT Licensed\n */\n\n\n\n/**\n * Module exports.\n * @public\n */\n\nmodule.exports = unpipe\n\n/**\n * Determine if there are Node.js pipe-like data listeners.\n * @private\n */\n\nfunction hasPipeDataListeners(stream) {\n  var listeners = stream.listeners('data')\n\n  for (var i = 0; i < listeners.length; i++) {\n    if (listeners[i].name === 'ondata') {\n      return true\n    }\n  }\n\n  return false\n}\n\n/**\n * Unpipe a stream from all destinations.\n *\n * @param {object} stream\n * @public\n */\n\nfunction unpipe(stream) {\n  if (!stream) {\n    throw new TypeError('argument stream is required')\n  }\n\n  if (typeof stream.unpipe === 'function') {\n    // new-style\n    stream.unpipe()\n    return\n  }\n\n  // Node.js 0.8 hack\n  if (!hasPipeDataListeners(stream)) {\n    return\n  }\n\n  var listener\n  var listeners = stream.listeners('close')\n\n  for (var i = 0; i < listeners.length; i++) {\n    listener = listeners[i]\n\n    if (listener.name !== 'cleanup' && listener.name !== 'onclose') {\n      continue\n    }\n\n    // invoke the listener\n    listener.call(stream)\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9iYWNrZW5kL25vZGVfbW9kdWxlcy91bnBpcGUvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQixzQkFBc0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWtCLHNCQUFzQjtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkQ6XFxCb29rYmF6emFyIG5leHRqc1xcYmFja2VuZFxcbm9kZV9tb2R1bGVzXFx1bnBpcGVcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogdW5waXBlXG4gKiBDb3B5cmlnaHQoYykgMjAxNSBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvblxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1bnBpcGVcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdGhlcmUgYXJlIE5vZGUuanMgcGlwZS1saWtlIGRhdGEgbGlzdGVuZXJzLlxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBoYXNQaXBlRGF0YUxpc3RlbmVycyhzdHJlYW0pIHtcbiAgdmFyIGxpc3RlbmVycyA9IHN0cmVhbS5saXN0ZW5lcnMoJ2RhdGEnKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGxpc3RlbmVyc1tpXS5uYW1lID09PSAnb25kYXRhJykge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBVbnBpcGUgYSBzdHJlYW0gZnJvbSBhbGwgZGVzdGluYXRpb25zLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdHJlYW1cbiAqIEBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiB1bnBpcGUoc3RyZWFtKSB7XG4gIGlmICghc3RyZWFtKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc3RyZWFtIGlzIHJlcXVpcmVkJylcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc3RyZWFtLnVucGlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIG5ldy1zdHlsZVxuICAgIHN0cmVhbS51bnBpcGUoKVxuICAgIHJldHVyblxuICB9XG5cbiAgLy8gTm9kZS5qcyAwLjggaGFja1xuICBpZiAoIWhhc1BpcGVEYXRhTGlzdGVuZXJzKHN0cmVhbSkpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBsaXN0ZW5lclxuICB2YXIgbGlzdGVuZXJzID0gc3RyZWFtLmxpc3RlbmVycygnY2xvc2UnKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV1cblxuICAgIGlmIChsaXN0ZW5lci5uYW1lICE9PSAnY2xlYW51cCcgJiYgbGlzdGVuZXIubmFtZSAhPT0gJ29uY2xvc2UnKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIC8vIGludm9rZSB0aGUgbGlzdGVuZXJcbiAgICBsaXN0ZW5lci5jYWxsKHN0cmVhbSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./backend/node_modules/unpipe/index.js\n");

/***/ })

};
;