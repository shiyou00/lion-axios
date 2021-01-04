import Axios from "./core/Axios";
import { extend } from "./helpers/util";
import defaults from "./defaults";
import mergeConfig from "./core/mergeConfig";
import CancelToken from "./cancel/CancelToken";
import Cancel, { isCancel } from "./cancel/Cancel";

function createInstance(config) {
  const context = new Axios(config);

  const instance = Axios.prototype.request.bind(context);

  extend(instance, Axios.prototype, context);

  return instance;
}

const axios = createInstance(defaults);

axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

axios.create = function (config) {
  return createInstance(mergeConfig(defaults, config));
};

export default axios;
