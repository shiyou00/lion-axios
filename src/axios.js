function extend(to, from, ctx) {
  Object.getOwnPropertyNames(from).forEach((key) => {
    to[key] = from[key].bind(ctx);
  });
  return to;
}

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

function isDate(val) {
  return toString.call(val) === "[object Date]";
}

function isPlainObject(val) {
  return toString.call(val) === "[object Object]";
}

function isURLSearchParams(val) {
  return typeof val !== "undefined" && val instanceof URLSearchParams;
}

const buildURL = (url, params) => {
  // 如果 params 参数为空，则直接返回原 URL
  if (!params) {
    return url;
  }
  // 定义一个变量，用来保存最终拼接后的参数
  let serializedParams;
  // 检测 params 是不是 URLSearchParams 对象类型
  if (isURLSearchParams(params)) {
    // 如果是（例如：new URLSearchParams(topic=api&foo=bar)），则 params 直接序列化输出
    serializedParams = params.toString();
  } else {
    // 如果不是则进入该主体运行
    // 定义一个数组
    const parts = [];
    // Object.keys 可以获取一个对象的所有key的数组，通过 forEach 进行遍历
    Object.keys(params).forEach((key) => {
      // 获取每个key对象的val
      const val = params[key];
      // 如果 val 是 null，或者是 undefined 则终止这轮循环，进入下轮循环，这里就是忽略空值操作
      if (val === null || typeof val === "undefined") {
        return;
      }
      // 定义一个数组
      let values = [];
      // 判断 val 是否是一个数组类型
      if (Array.isArray(val)) {
        // 是的话，values空数组赋值为 val，并且 key 拼接上[]
        values = val;
        key += "[]";
      } else {
        // val 不是数组的话，也让它变为数组，抹平数据类型不同的差异，方便后面统一处理
        values = [val];
      }
      // 由于前面抹平差异，这里可以统一当做数组进行处理
      values.forEach((val) => {
        // 如果 val 是日期对象，
        if (isDate(val)) {
          // toISOString返回Date对象的标准的日期时间字符串格式的字符串
          val = val.toISOString();
          // 如果 val 是对象类型的话，直接序列化
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val);
        }
        // 处理结果推入数组
        parts.push(`${encode(key)}=${encode(val)}`);
      });
    });
    // 最后拼接数组
    serializedParams = parts.join("&");
  }

  if (serializedParams) {
    // 处理 hash 的情况
    const markIndex = url.indexOf("#");
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }
    // 处理，如果传入已经带有参数，则拼接在其后面，否则要手动添加上一个 ?
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  // 输出完整的 URL
  return url;
};

const transformURL = (config) => {
  const { url, params } = config;
  return buildURL(url, params);
};

const transformRequest = (data) => {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
};

const transformRequestData = (config) => {
  return transformRequest(config.data);
};

const normalizeHeaderName = (headers, normalizedName) => {
  if (!headers) {
    return;
  }
  // 遍历所有 headers
  Object.keys(headers).forEach((name) => {
    // 处理这种情况 如果 name 是 content-type，normalizedName 是 Content-Type，则统一使用 Content-Type
    // 并且删除 content-type。
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  });
};

const parseHeaders = (headers) => {
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }

  headers.split("\r\n").forEach((line) => {
    let [key, ...vals] = line.split(":");
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    parsed[key] = vals.join(":").trim();
  });

  return parsed;
};

const processHeaders = (headers, data) => {
  normalizeHeaderName(headers, "Content-Type");
  // 判断如果data数据是一个对象，则设置上'Content-Type'
  if (isPlainObject(data)) {
    if (headers && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json;charset=utf-8";
    }
  }
  return headers;
};

const transformHeaders = (config) => {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
};

const processConfig = (config) => {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
};
// 如果 data 是 string 类型，试图转换成 JSON 类型
const transformResponse = (data) => {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
      // eslint-disable-next-line
    } catch (e) {}
  }
  return data;
};
// 转换输出数据函数
const transformResponseData = (res) => {
  res.data = transformResponse(res.data);
  return res;
};

const xhr = (config) => {
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

class Axios {
  config = {};

  constructor(initConfig) {
    this.config = initConfig;
  }

  request(config) {
    // 处理传入的配置
    processConfig(config);
    // 发送请求
    return xhr(config).then((res) => transformResponseData(res));
  }

  get() {}

  delete() {}

  head() {}

  options() {}

  post() {}

  put() {}

  patch() {}
}

function createInstance(initConfig) {
  const context = new Axios(initConfig);

  const instance = Axios.prototype.request.bind(context);

  extend(instance, Axios.prototype, context);

  return instance;
}

const defaults = {
  method: "get",
};

const axios = createInstance(defaults);

axios.create = function () {
  // const initConfig = mergeConfig(config,defaults);
  return createInstance(defaults);
};

export default axios;
