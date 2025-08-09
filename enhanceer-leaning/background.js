const handleMessage = (
    { url: e, method: t, headers: a, data: r, identifier: i },
    n,
    o
  ) =>
    fetch(e, { method: t, headers: a, body: r })
      .then(async (e) =>
        o({
          response: 204 === e.status ? "redirected" : await e.text(),
          status: e.status ?? 400,
          identifier: i,
        })
      )
      .catch(() => o({ status: 500, identifier: i })),
  closeCurrentTab = () => {
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
      chrome.tabs.remove(e[0].id, function () {});
    });
  },
  sendNotification = (e, t, { notificationId: a, ...r }) => {
    chrome.notifications.create(a ?? "", {
      title: e,
      message: t,
      iconUrl: "/icon128.png",
      type: "basic",
      ...r,
    });
  };
chrome.notifications.onClicked.addListener((e) => {
  "transferList" === e &&
    chrome.tabs.create({
      url: "https://www.ea.com/ea-sports-fc/ultimate-team/web-app/?tradepile",
    });
}),
  chrome.runtime.onMessage.addListener(function (e, t, a) {
    const { options: r } = e;
    return "closeWebApp" === r
      ? (chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
          chrome.tabs.remove(e[0].id, function () {});
        }),
        !1)
      : "notification" === r.type
      ? (sendNotification(r.message, r.message, {}), !1)
      : "createAlarm" === r.type
      ? (createAlarm(r.alarmType, r.intervalInMinutes, r.when), !1)
      : "clearAlarm" === r.type
      ? (chrome.alarms.clear(r.alarmType), !1)
      : "changeContext" === r.type
      ? (updateUserAgentRule(r.isEnabled), !1)
      : (handleMessage(r, 0, a), !0);
  });
const createAlarm = (e, t, a) => {
  chrome.alarms.clear(e),
    chrome.alarms.create(e, { periodInMinutes: t, when: a });
};
chrome.alarms.onAlarm.addListener(function ({ name: e }) {
  "previewPack" === e
    ? sendNotification("You may have not opened the preview pack today")
    : "transferList" === e &&
      sendNotification(
        "Active Transfers Alarm",
        "Notification triggered based on your active transfers alarm setting",
        { notificationId: "transferList", priority: 2 }
      );
});
