import { isPlainObject } from "./util";

export const transformRequest = (data) => {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
};

// 如果 data 是 string 类型，试图转换成 JSON 类型
export const transformResponse = (data) => {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
      // eslint-disable-next-line
    } catch (e) {}
  }
  return data;
};
