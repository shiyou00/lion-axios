const baseURL = "https://reqres.in/api/users";

// axios({
//   method: "post",
//   url: baseURL,
//   headers:{
//     cc:"ccc"
//   },
//   data: {
//     "name": "frankshi",
//     "job": "FE"
//   },
// });

axios({
  method: "get",
  url: `${baseURL}?foo=bar`,
  responseType: "json",
  params: {
    bar: "baz",
  },
}).then((res) => {
  console.log(res);
});

axios({
  method: "get",
  url: `${baseURL}?foo=bar`,
  params: {
    bar: "baz1",
  },
}).then((res) => {
  console.log(res);
});

// axios({
//   method: "get",
//   url:"/error/page"
// }).catch((err)=>{
//   console.log(err);
// })
