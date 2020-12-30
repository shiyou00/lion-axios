import dispatchRequest from "./dispatchRequest";

class Axios {
  config = {};

  constructor(initConfig) {
    this.config = initConfig;
  }

  request(config) {
    return dispatchRequest(config);
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
