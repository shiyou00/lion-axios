import { parseHeaders } from "../helpers/headers";

module.exports = function xhrAdapter(config) {
  return new Promise((resolve) => {
    let {
      data = null,
      url,
      method = "get",
      headers = {},
      responseType,
    } = config;

    const request = new XMLHttpRequest();
    request.open(method.toUpperCase(), url, true);

    if (responseType) {
      request.responseType = responseType;
    }

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 0) {
        return;
      }
      // 返回的 header 是字符串类型，通过 parseHeaders 解析成对象类型
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData =
        responseType && responseType !== "text"
          ? request.response
          : request.responseText;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      };
      resolve(response);
    };

    // 遍历所有处理后的 headers
    Object.keys(headers).forEach((name) => {
      // 如果 data 为空的话，则删除 content-type
      if (data === null && name.toLowerCase() === "content-type") {
        delete headers[name];
      } else {
        // 给请求设置上 header
        request.setRequestHeader(name, headers[name]);
      }
    });
    request.send(data);
  });
};
