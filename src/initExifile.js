import { startScrapingPage } from "./pageActions/startScrapingPage";
import { timeout } from "./util";

const message1 = `<h3>Vertical scrolling is not enabled! Enabling and reloading.</h3> 
<p>Please click on exifile bookmarklet again after page reloads</p>.
<p>If that doesn't work please try to do the following yourself, and then start Exifile</p>
<ol class="info-list">
    <li>Vertical scrolling: Go to "Display Settings". Change scrolling direction to "Vertical Scrolling"</li>
    <li>Day Theme:  Go to "Display Settings" and change theme to "Day Theme"</li>
  </ol>
`;

export const initExifile = async e => {
  const verticalScrolling =
    document.getElementsByClassName("vertical_reader_container").length > 0;
  // "vertical_scroll" = false
  if (verticalScrolling) {
    startScrapingPage();
  } else {
    e.innerHTML = message1;
    console.log(
      "vertical scrolling is not enabled. Exifile will enable vertical scrolling. Please click on exifile bookmarklet again after page reloads"
    );
    await timeout(1000);
    // enableVerticalScrolling
    window.location.href =
      window.location.origin + window.location.pathname + "?mode=standard";
  }
};
