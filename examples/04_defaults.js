axios.defaults.headers.common["test3"] = 123;

const baseURL = "https://reqres.in/api/users";

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
