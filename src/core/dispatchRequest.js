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

const getDefaultAdapter = () => {
  let adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    // 浏览器
    adapter = require("../adapters/xhr");
  } else if (
    typeof process !== "undefined" &&
    Object.prototype.toString.call(process) === "[object process]"
  ) {
    // node.js
    adapter = require("../adapters/http");
  }
  return adapter;
};

const dispatchRequest = (config) => {
  const adapter = config.adapter || getDefaultAdapter();

  // 处理传入的配置
  processConfig(config);
  // 发送请求
  return adapter(config).then((res) => transformResponseData(res));
};

export default dispatchRequest;
