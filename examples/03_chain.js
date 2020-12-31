const baseURL = "https://reqres.in/api/users";

console.log(axios.interceptors.request);

axios.interceptors.request.use((config) => {
  config.headers.test = "123";
  return config;
});

axios.interceptors.response.use((res) => {
  return res.data;
});

axios({
  method: "get",
  url: `${baseURL}?foo=bar`,
  headers: {
    test: "",
  },
  params: {
    bar: "baz1",
  },
}).then((res) => {
  console.log(res);
});
