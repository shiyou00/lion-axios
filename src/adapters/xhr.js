import { parseHeaders } from "../helpers/headers";
import { createError } from "../core/error";

module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    let {
      data = null,
      url,
      method = "get",
      headers = {},
      responseType,
      timeout,
      cancelToken,
    } = config;

    const request = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType;
    }
    // 判断是否有超时的配置，如果有则给request添加超时属性
    if (timeout) {
      request.timeout = timeout;
    }

    request.open(method.toUpperCase(), url, true);

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
      // 如果状态码在 200-300 之间正常 resolve，否则 reject 错误
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        );
      }
    };
    // 监听错误
    request.onerror = () => {
      reject(createError(`Network Error`, config, null, request));
    };
    // 监听超时
    request.ontimeout = () => {
      // ECONNABORTED 通常表示一个被中止的请求
      reject(
        createError(
          `Timeout of ${config.timeout} ms exceeded`,
          config,
          "ECONNABORTED",
          request
        )
      );
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

    if (cancelToken) {
      cancelToken.promise
        .then((reason) => {
          request.abort();
          reject(reason);
        })
        .catch(() => {});
    }

    request.send(data);
  });
};
