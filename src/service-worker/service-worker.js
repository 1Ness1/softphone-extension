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
}

const setupOffscreenDocument = async (path = OFFSCREEN_DOCUMENT) => {
  if(await hasDocument()) {
    return;
  }

  if(isCreatedOffscreenDocument) {
    await isCreatedOffscreenDocument;
    return;
  }

  isCreatedOffscreenDocument = chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT,
    reasons: ["WEB_RTC"],
    justification: "testing web rtc soft phone"
  })

  await isCreatedOffscreenDocument;
  isCreatedOffscreenDocument = null;
}

const initialize = async () => {
  await setupOffscreenDocument();

  chrome.runtime.sendMessage({
    type: "RTC",
    target: "offscreen",
    data: "testing RTC"
  })
}

initialize();


chrome.runtime.onMessage.addListener((message) => {
  if (message.target !== 'background') {
    return;
  }

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case 'log':
      // console.log("asdf")
      // handleAddExclamationMarkResult(message.data);
      // closeOffscreenDocument();
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
})