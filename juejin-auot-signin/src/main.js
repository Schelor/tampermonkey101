const storageKey = "last_sign_timestamp";
// 获取上一次签到的日子
const lastSignNumberOfDays = GM_getValue(storageKey, 0);
// 计算现在所在的日子
const currentNumberOfDays = Math.floor(
  new Date().valueOf() / 1000 / 60 / 60 / 24
);

// 如果今天已经请求过，不再请求
if (currentNumberOfDays !== lastSignNumberOfDays) {
  console.log('currentNumberOfDays', currentNumberOfDays);
}

GM_xmlhttpRequest({
  url: "https://api.juejin.cn/interact_api/v1/digg/save?aid=2608&uuid=7330445368745838134&spider=0&verifyFp=verify_ma52yanc_Rl1IvgLk_pqGv_4yc2_BEqH_YsS2RhmjgUYv&fp=verify_ma52yanc_Rl1IvgLk_pqGv_4yc2_BEqH_YsS2RhmjgUYv&msToken=8O3xgF6TqxLjzzO_TpcQathAbsjXfoJYGcdVzs9VXIKRjzRWDPhFuXaptEgKdGC6h0uGSxu2rVPF997_iAgcJYJHRuAQMAxcD1ME-Vvy-3YfQa67ZzLrEl-38NMcXpf1mg%3D%3D&a_bogus=Ef0QDOgmMsm1UgHBshDz9r-XfxW0YWR0gZENIiynAUq5",
  method: "POST",
  headers: {
    "content-type": "application/json",
    "user-agent": navigator.userAgent
  },
  responseType: "json",
  onload(response) {
    console.log('response', response);
    console.log('responseText', response.responseText);
    debugger
    if (response.status === 200) {
    
      // 更新最近一次签到的日子
      GM_setValue(storageKey, currentNumberOfDays);
    }
  },
});

