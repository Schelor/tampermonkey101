// ==UserScript==
// @name         MockBbsLogin
// @namespace    http://tampermonkey.net/
// @version      2025-05-02
// @description  try to take over the world!
// @author       Xie.Le
// @match        https://www.52pojie.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  var input = document.querySelector("#ls_username");
  if (!input) {
    console.log("input not found");
    return;
  }
  document.querySelector("#ls_username").value = "账号";
  document.querySelector("#ls_password").value = "pwd";
  document.querySelector("#ls_cookietime").checked = true;

  document.querySelector(".fastlg_l button").click();
//这里的意思是先找到class名为fastlg_l的dom元素，在找在这个元素下叫做button的子元素


})();
