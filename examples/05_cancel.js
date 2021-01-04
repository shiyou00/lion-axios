const CancelToken = axios.CancelToken;
const source = CancelToken.source();
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
  cancelToken: source.token,
})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
    } else {
      // 处理错误
    }
  });

source.cancel("Operation canceled by the user.");
