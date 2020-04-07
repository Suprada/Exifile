export const scrollDownPage = () => {
  return new Promise((resolve) => {
    // console.log("in scrollDownPage");
    const verticalPages = document.getElementsByClassName("vertical_page");
    verticalPages[verticalPages.length - 1].scrollIntoView();
    var buttonsContainer = document.getElementsByClassName("buttons_container");
    buttonsContainer[0].scrollIntoView();
    // console.log("done scroll down page");
    resolve();
  });
};
