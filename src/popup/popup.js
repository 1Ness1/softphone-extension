import { EVENTS } from "../utils/types/events.d";

const button = document.querySelector(`[data-click]`);

console.log(button);
button.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    type: EVENTS._TEST,
    target: "offscreen",
    data: "testing RTC",
  });
});
