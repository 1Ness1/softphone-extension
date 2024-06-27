import { EVENTS } from "../utils/types/events.d";

// chrome.storage.local.set({ key: "value" }).then(() => {
//     console.log("Value is set");
//   });

//   chrome.storage.local.get(["key"]).then((result) => {
//     console.log("Value is " + result.key);
//   });

window.addEventListener("message", function (event) {
  if (!event.data.type) return;

  if (event.data.type === EVENTS.INITIALIZATION) {
    console.log(event.data);
    chrome.runtime.sendMessage({ type: EVENTS.INITIALIZATION, ...event.data.data });
  }

  if (event.data.type === EVENTS.OUTGOING_CALL) {
    console.log(event.data);
    chrome.runtime.sendMessage({ type: EVENTS.OUTGOING_CALL, ...event.data.data });
  }

  if (event.data.type === EVENTS.HANG_UP_CALL) {
    console.log(event.data);
    chrome.runtime.sendMessage({ type: EVENTS.HANG_UP_CALL });
  }
});
