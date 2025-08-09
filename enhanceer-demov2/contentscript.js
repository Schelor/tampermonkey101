const mainScript = document.createElement("script");
mainScript.src = chrome.runtime.getURL("js/main.js");
const vendorScript = document.createElement("script");
(vendorScript.src = chrome.runtime.getURL("js/vendor.js")),
  (document.head || document.documentElement).appendChild(mainScript),
  (document.head || document.documentElement).appendChild(vendorScript),
  (mainScript.onload = function () {
    mainScript.parentNode.removeChild(mainScript);
  }),
  (vendorScript.onload = function () {
    vendorScript.parentNode.removeChild(vendorScript);
  });
const supportedMessageTypes = new Set([
    "notification",
    "createAlarm",
    "clearAlarm",
  ]),
  handleScriptEvents = (e) => {
    "fetchFromExternal" === e.data.type
      ? chrome.runtime.sendMessage(e.data.payload, (e) =>
          window.postMessage({ response: e })
        )
      : "fetchExtensionLogo" === e.data.type
      ? window.postMessage({
          response: {
            response: chrome.runtime.getURL("header_image.png"),
            status: 200,
            identifier: e.data.payload.identifier,
          },
        })
      : "closeWebApp" === e.data.type
      ? chrome.runtime.sendMessage({ options: "closeWebApp" })
      : supportedMessageTypes.has(e.data.type) &&
        chrome.runtime.sendMessage({
          options: { type: e.data.type, ...e.data.payload },
        });
  };
window.addEventListener("message", handleScriptEvents);
