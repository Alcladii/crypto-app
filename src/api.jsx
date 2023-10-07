import axios from "axios";

async function api(url, search) {
  const base = "https://api.coingecko.com/api/v3";
  const fullURL = `${base}${url}?${search}`;
  const fileName1 = search.split("=").filter((s) => s);
  const order = fileName1[2].split("&");
  const file = await import(`./mocks/${order[0]}.json`);

  if (process.env.NODE_ENV === "development") {
    return new Promise((acc, rejected) => {
      setTimeout(
        () =>
          acc({
            data: file.default,
          }),
        1000
      );
    });
  } else {
    const response = await axios(fullURL);
    return response;
  }
}

export default api;
