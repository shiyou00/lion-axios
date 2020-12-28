import Axios from "./core/Axios";
import { extend } from "./helpers/util";

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
