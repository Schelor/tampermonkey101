// ==UserScript==
// @name         HelloWorldScript
// @namespace    http://tampermonkey.net/
// @version      2025-05-02
// @description  try to take over the world!
// @author       You
// @match       https://www.bilibili.com/video/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        none
// @run-at      document-end
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  console.log("hello,world");


  let triple = document.createElement("button");
  triple.innerText = "三连";
  triple.className = `triple_btn`
  triple.style.background = "#757575";//颜色弄得差不多吧
  triple.style.color = "#fff";
  triple.style.border = "none";
  
  triple.onclick = function () {
      //三连代码
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', 'https://api.bilibili.com/x/web-interface/archive/like/triple');
      httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      httpRequest.withCredentials = true;//设置跨域发送
      let aid = window.__INITIAL_STATE__.aid;
      let sKey = "bili_jct";
      let csrf = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      httpRequest.send('aid=' + aid + '&csrf=' + csrf);
      console.log('aid', aid, 'scrf', csrf);
      httpRequest.onreadystatechange = function () {
          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
              var json = JSON.parse(httpRequest.responseText);
              console.log(json);
              if (json.code == 0) {
                  alert("三连成功!刷新页面可见");
              } else {
                  alert("三连失败/(ㄒoㄒ)/~~");
              }
          }
      };
  };
  let ops = document.querySelector('#arc_toolbar_report .video-toolbar-left');
  let observer = new MutationObserver(function (mutations) {
      let share = document.querySelector('.video-share-wrap');
      if (share.parentElement.querySelector('.triple_btn') == null) {
          share.parentElement.appendChild(triple);
      }
  });
  observer.observe(ops, { childList: true, subtree: true });


})();
