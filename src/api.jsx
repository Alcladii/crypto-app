import axios from "axios";

async function api(url, search) {
  const base = "https://api.coingecko.com/api/v3";
  const fullURL = `${base}${url}?${search}`;
  /*const fileName = url.split("/").filter((s) => s);*/
  const fileName1 = search.split("=").filter((s) => s);
  const order = fileName1[2].split("&");
  //console.log(order)
  const file = await import(`./mocks/${order[0]}.json`);

  if (process.env.NODE_ENV === "development") {
    return new Promise((acc, rejected) => {
      setTimeout(
        () =>
          acc({
            data: file.default,
            //coins: file.default
          }),
        1000
      );
      //console.log("fake data run")
    });
  } else {
    const response = await axios(fullURL);
    //console.log("real data run")
    return response;
  }
}

export default api;
