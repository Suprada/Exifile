export const getLastPage = (annotations) => {
  // console.log(
  //   "in getLastPage. Not real last page but last page for rendering"
  // );
  return new Promise((resolve) => {
    const lastPage = document
      .getElementById("footer")
      .innerText.split(" ")[3]
      .split(",")[0];

    resolve(Number(lastPage));
  });
};
