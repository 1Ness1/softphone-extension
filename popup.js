const button = document.querySelector("button");

button.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        type: "TEST",
        target: "offscreen",
        data: "testing RTC"
      })
})