import { flattenHeaders } from "../helpers/headers";
import { buildURL } from "../helpers/url";
import transform from "./transform";
import defaults from "../defaults";

const transformURL = (config) => {
  const { url, params } = config;
  return buildURL(url, params);
};

const processConfig = (config) => {
  config.url = transformURL(config);
  config.data = transform(config.data, config.headers, config.transformRequest);
  config.headers = flattenHeaders(config.headers, config.method);
};

// 转换输出数据函数
const transformResponseData = (res) => {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
};

function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

const dispatchRequest = (config) => {
  throwIfCancellationRequested(config);
  const adapter = config.adapter || defaults.adapter;
  // 处理传入的配置
  processConfig(config);
  // 发送请求
  return adapter(config).then((res) => transformResponseData(res));
};

export default dispatchRequest;
