(()=>{"use strict";const e="INITIALIZATION",t="OUTGOING_CALL",r="HANG_UP_CALL",o="offscreen";function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}window.addEventListener("message",(n=>{var i,s;"content-script"===(null===(i=n.data.data)||void 0===i?void 0:i.target)&&null!==(s=n.data)&&void 0!==s&&s.type&&(n.data.type===e&&(console.log(n.data),chrome.runtime.sendMessage(a(a({type:e},n.data.data),{},{target:o}))),n.data.type===t&&(console.log(n.data),chrome.runtime.sendMessage(a(a({type:t},n.data.data),{},{target:o}))),n.data.type===r&&(console.log(n.data),chrome.runtime.sendMessage({type:r,target:o})),"OUTGOING_CALL_EXTENSION"===n.data.type&&console.log(n.data))})),chrome.runtime.onMessage.addListener(((e,t,r)=>{console.log(e),window.postMessage({type:"SHOW_MODAL",target:"vue"}),window.postMessage({type:"SHOW_MODAL",target:"web"})}))})();