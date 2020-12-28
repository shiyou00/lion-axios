import dispatchRequest from "./dispatchRequest";

class Axios {
  config = {};

  constructor(initConfig) {
    this.config = initConfig;
  }

  request(config) {
    return dispatchRequest(config);
  }

  get() {}

  delete() {}

  head() {}

  options() {}

  post() {}

  put() {}

  patch() {}
}

export default Axios;
