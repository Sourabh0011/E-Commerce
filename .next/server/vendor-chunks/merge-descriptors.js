"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/merge-descriptors";
exports.ids = ["vendor-chunks/merge-descriptors"];
exports.modules = {

/***/ "(api)/./backend/node_modules/merge-descriptors/index.js":
/*!*********************************************************!*\
  !*** ./backend/node_modules/merge-descriptors/index.js ***!
  \*********************************************************/
/***/ ((module) => {

eval("\n\nfunction mergeDescriptors(destination, source, overwrite = true) {\n\tif (!destination) {\n\t\tthrow new TypeError('The `destination` argument is required.');\n\t}\n\n\tif (!source) {\n\t\tthrow new TypeError('The `source` argument is required.');\n\t}\n\n\tfor (const name of Object.getOwnPropertyNames(source)) {\n\t\tif (!overwrite && Object.hasOwn(destination, name)) {\n\t\t\t// Skip descriptor\n\t\t\tcontinue;\n\t\t}\n\n\t\t// Copy descriptor\n\t\tconst descriptor = Object.getOwnPropertyDescriptor(source, name);\n\t\tObject.defineProperty(destination, name, descriptor);\n\t}\n\n\treturn destination;\n}\n\nmodule.exports = mergeDescriptors;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9iYWNrZW5kL25vZGVfbW9kdWxlcy9tZXJnZS1kZXNjcmlwdG9ycy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJEOlxcQm9va2JhenphciBuZXh0anNcXGJhY2tlbmRcXG5vZGVfbW9kdWxlc1xcbWVyZ2UtZGVzY3JpcHRvcnNcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gbWVyZ2VEZXNjcmlwdG9ycyhkZXN0aW5hdGlvbiwgc291cmNlLCBvdmVyd3JpdGUgPSB0cnVlKSB7XG5cdGlmICghZGVzdGluYXRpb24pIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgYGRlc3RpbmF0aW9uYCBhcmd1bWVudCBpcyByZXF1aXJlZC4nKTtcblx0fVxuXG5cdGlmICghc291cmNlKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGBzb3VyY2VgIGFyZ3VtZW50IGlzIHJlcXVpcmVkLicpO1xuXHR9XG5cblx0Zm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkpIHtcblx0XHRpZiAoIW92ZXJ3cml0ZSAmJiBPYmplY3QuaGFzT3duKGRlc3RpbmF0aW9uLCBuYW1lKSkge1xuXHRcdFx0Ly8gU2tpcCBkZXNjcmlwdG9yXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHQvLyBDb3B5IGRlc2NyaXB0b3Jcblx0XHRjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIG5hbWUpO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0aW5hdGlvbiwgbmFtZSwgZGVzY3JpcHRvcik7XG5cdH1cblxuXHRyZXR1cm4gZGVzdGluYXRpb247XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2VEZXNjcmlwdG9ycztcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./backend/node_modules/merge-descriptors/index.js\n");

/***/ })

};
;