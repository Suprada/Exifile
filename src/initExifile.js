import { startScrapingPage } from "./pageActions/startScrapingPage";

export const initExifile = async () => {
  const verticalScrolling =
    document.getElementsByClassName("vertical_reader_container").length > 0;
  if (verticalScrolling) {
    startScrapingPage();
  } else {
    e.innerHTML =
      "<h3>Vertical scrolling is not enabled.</h3><h3>Exifile will enable vertical scrolling.</h3><h3>Please click on exifile bookmarklet again after page reloads</h3>";
    console.log(
      "vertical scrolling is not enabled. Exifile will enable vertical scrolling. Please click on exifile bookmarklet again after page reloads"
    );
    // enableVerticalScrolling
    window.location.href =
      window.location.origin + window.location.pathname + "?mode=standard";
  }
};
