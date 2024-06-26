const button = document.querySelector(`[data-click]`);

console.log(button)
button.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        type: "TEST",
        target: "offscreen",
        data: "testing RTC"
      })
})