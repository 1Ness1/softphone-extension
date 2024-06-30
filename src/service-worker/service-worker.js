import { TARGETS } from "../utils/types/types.d";
import { EVENTS } from "../utils/types/events.d";

const OFFSCREEN_DOCUMENT = "offscreen.html";

let isCreatedOffscreenDocument = null;

const hasDocument = async () => {
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT)) {
      return true;
    }
  }
  return false;
};

const setupOffscreenDocument = async () => {
  if (await hasDocument()) {
    return;
  }

  if (isCreatedOffscreenDocument) {
    await isCreatedOffscreenDocument;
    return;
  }

  isCreatedOffscreenDocument = chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT,
    reasons: ["WEB_RTC"],
    justification: "testing web rtc soft phone",
  });

  await isCreatedOffscreenDocument;
  isCreatedOffscreenDocument = null;
};

const initialize = async () => {
  await setupOffscreenDocument();
};

initialize();

chrome.runtime.onMessage.addListener((message) => {
  if (message?.target !== TARGETS.SERVICE_WORKER) {
    return;
  }

  if (message.type === EVENTS.OUTGOING_CALL_EXTENSION) {
    console.log(message);
    // chrome.storage.local.set({ name });

    chrome.tabs.query({}).then(result => {
      result.forEach(element => {
          if(element.url.includes("oxg.local")) {
              console.log(element)
               chrome.tabs.sendMessage(element.id, {
                target: TARGETS.CONTENT_SCRIPT,
                data: message.data
               })
          }
      })
    })
  }
});