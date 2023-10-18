export default function getData(url) {
  let result;
  if (!url) {
    console.log("Invalid url");
    return new Promise((resolve, reject) => {
      throw new Error("Invalid URL");
    });
  }

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      result = data;
      return result;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}
