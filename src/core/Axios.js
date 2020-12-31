import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";

class Axios {
  config = {};
  interceptors = {};

  constructor(initConfig) {
    this.config = initConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  request(url, config) {
    if (typeof url === "string") {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    const chain = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while (chain.length) {
      const { resolved, rejected } = chain.shift();
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }

  get(url, config) {
    return this._requestMethodWithoutData("get", url, config);
  }

  delete(url, config) {
    return this._requestMethodWithoutData("delete", url, config);
  }

  head(url, config) {
    return this._requestMethodWithoutData("head", url, config);
  }

  options(url, config) {
    return this._requestMethodWithoutData("head", url, config);
  }

  post(url, data, config) {
    return this._requestMethodWithData("post", url, data, config);
  }

  put(url, data, config) {
    return this._requestMethodWithData("put", url, data, config);
  }

  patch(url, data, config) {
    return this._requestMethodWithData("patch", url, data, config);
  }

  _requestMethodWithoutData(method, url, config) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      })
    );
  }

  _requestMethodWithData(method, url, data, config) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      })
    );
  }
}

export default Axios;
