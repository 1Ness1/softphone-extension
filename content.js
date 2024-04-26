// document.addEventListener("retrievePageVariable", () => {
//     document.dispatchEvent(
//       new CustomEvent("variableRetrieved", {
//         detail: webPageVariable,
//       }),
// //     );
// //   });

// console.log(chrome)

// var YourExt = {
//     doThis: function () {
//         chrome.extension.sendRequest('doThis');
//     },
//     doThat: function () {
//         chrome.extension.sendRequest({
//             action: 'doThat',
//             params: ['foo','bar']
//         });
//     }
//     }

document.addEventListener("retrievePageVariable", () => {
    document.dispatchEvent(
      new CustomEvent("variableRetrieved", {
        detail: webPageVariable,
      }),
    );
  });
//
// var data = { type: "FROM_PAGEs", text: {
//   host: window.location.host,
//   test: "test"
// } };
// window.postMessage(data, "*");