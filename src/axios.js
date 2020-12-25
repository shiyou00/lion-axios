function extend(to, from, ctx) {
  Object.getOwnPropertyNames(from).forEach((key) => {
    to[key] = from[key].bind(ctx);
  });
  return to;
}

class Axios {
  config = {};

  constructor(initConfig) {
    this.config = initConfig;
  }

  request(config) {
    console.log(config);
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
