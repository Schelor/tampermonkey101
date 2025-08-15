// 还原后的i18next配置模块代码
import i18next from 'i18next'; // 对应 n(50356)
import HttpBackend from 'i18next-http-backend'; // 对应 n(1391)
import ChainedBackend from 'i18next-chained-backend'; // 对应 n(35767)
import resourcesToBackend from 'i18next-resources-to-backend'; // 对应 n(49078)
import { sendRequest } from './utils'; // 对应 n(82125)
import enTranslations from './en-translations'; // 对应 n(2221)

// 导出i18next实例
export { i18next };

// 命名空间配置
const namespace = "ns1";

// 默认翻译资源
const defaultResources = {
  en: {
    [namespace]: enTranslations
  }
};

// 初始化i18next
i18next
  .use(ChainedBackend)
  .init({
    debug: true,
    fallbackLng: "en",
    defaultNS: namespace,
    ns: namespace,
    backend: {
      backends: [
        // 第一个后端：从本地资源加载
        resourcesToBackend(defaultResources),
        // 第二个后端：从远程CDN加载
        HttpBackend
      ],
      backendOptions: [
        // 本地资源后端选项（空配置）
        {},
        // HTTP后端选项
        {
          // 动态生成加载路径
          loadPath: ([language]) =>
            `https://translationcdn.futnext.com/extension/${language}/${namespace}.json`,

          // 自定义请求处理器
          request: async (options, url, payload, callback) => {
            try {
              // 使用自定义的sendRequest函数发送请求
              const response = await sendRequest(
                url,
                "GET",
                `${Math.floor(Date.now())}_translations`
              );

              // 成功回调
              callback(null, {
                status: 200,
                data: response
              });
            } catch (error) {
              // 错误回调
              callback(error, {
                status: 500,
                data: {}
              });
            }
          },
        },
      ],
    },
  });
