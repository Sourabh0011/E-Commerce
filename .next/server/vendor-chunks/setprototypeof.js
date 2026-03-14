"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/setprototypeof";
exports.ids = ["vendor-chunks/setprototypeof"];
exports.modules = {

/***/ "(api)/./backend/node_modules/setprototypeof/index.js":
/*!******************************************************!*\
  !*** ./backend/node_modules/setprototypeof/index.js ***!
  \******************************************************/
/***/ ((module) => {

eval("\n/* eslint no-proto: 0 */\nmodule.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties)\n\nfunction setProtoOf (obj, proto) {\n  obj.__proto__ = proto\n  return obj\n}\n\nfunction mixinProperties (obj, proto) {\n  for (var prop in proto) {\n    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {\n      obj[prop] = proto[prop]\n    }\n  }\n  return obj\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9iYWNrZW5kL25vZGVfbW9kdWxlcy9zZXRwcm90b3R5cGVvZi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTtBQUNaO0FBQ0EsNkNBQTZDLGdCQUFnQjs7QUFFN0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiRDpcXEJvb2tiYXp6YXIgbmV4dGpzXFxiYWNrZW5kXFxub2RlX21vZHVsZXNcXHNldHByb3RvdHlwZW9mXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcbi8qIGVzbGludCBuby1wcm90bzogMCAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgPyBzZXRQcm90b09mIDogbWl4aW5Qcm9wZXJ0aWVzKVxuXG5mdW5jdGlvbiBzZXRQcm90b09mIChvYmosIHByb3RvKSB7XG4gIG9iai5fX3Byb3RvX18gPSBwcm90b1xuICByZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIG1peGluUHJvcGVydGllcyAob2JqLCBwcm90bykge1xuICBmb3IgKHZhciBwcm9wIGluIHByb3RvKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgb2JqW3Byb3BdID0gcHJvdG9bcHJvcF1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9ialxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./backend/node_modules/setprototypeof/index.js\n");

/***/ })

};
;