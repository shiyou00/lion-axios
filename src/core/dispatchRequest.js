import xhr from "../adapters/xhr";
import { transformRequest, transformResponse } from "../helpers/data";
import { processHeaders } from "../helpers/headers";
import { buildURL } from "../helpers/url";

const transformURL = (config) => {
  const { url, params } = config;
  return buildURL(url, params);
};

const transformHeaders = (config) => {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
};

const transformRequestData = (config) => {
  return transformRequest(config.data);
};

const processConfig = (config) => {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
};

// 转换输出数据函数
const transformResponseData = (res) => {
  res.data = transformResponse(res.data);
  return res;
};

const dispatchRequest = (config) => {
  // 处理传入的配置
  processConfig(config);
  // 发送请求
  return xhr(config).then((res) => transformResponseData(res));
};

export default dispatchRequest;
