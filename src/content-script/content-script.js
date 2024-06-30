import { EVENTS } from "../utils/types/events.d";
import { TARGETS } from "../utils/types/types.d";

// chrome.storage.local.set({ key: "value" }).then(() => {
//     console.log("Value is set");
//   });

//   chrome.storage.local.get(["key"]).then((result) => {
//     console.log("Value is " + result.key);
//   });

window.addEventListener("message", (event) => {
  if(event.data.data?.target !== TARGETS.CONTENT_SCRIPT) return;
  
  if (!event.data?.type) return;

  if (event.data.type === EVENTS.INITIALIZATION) {
    console.log(event.data);
    chrome.runtime.sendMessage({ 
      type: EVENTS.INITIALIZATION,
      ...event.data.data,
      target: TARGETS.OFFSCREEN,
    });
  }

  if (event.data.type === EVENTS.OUTGOING_CALL) {
    console.log(event.data);
    chrome.runtime.sendMessage({ 
      type: EVENTS.OUTGOING_CALL, 
      ...event.data.data,
      target: TARGETS.OFFSCREEN
    });
  }

  if (event.data.type === EVENTS.HANG_UP_CALL) {
    console.log(event.data);
    chrome.runtime.sendMessage({ 
      type: EVENTS.HANG_UP_CALL,
      target: TARGETS.OFFSCREEN
    });
  }

  if(event.data.type === "OUTGOING_CALL_EXTENSION") {
    console.log(event.data);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request)

    window.postMessage({
      type: "SHOW_MODAL", 
      target: TARGETS.VUE,
    });

    window.postMessage({
      type: "SHOW_MODAL", 
      target: TARGETS.WEB,
    });
  }
);