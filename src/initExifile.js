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

export const initExifile = async (e) => {
  // experimental google analytics
  (function(i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    "script",
    "//www.google-analytics.com/analytics.js",
    "ga"
  );
  ga("create", "UA-74303935-1", "auto");
  ga("send", "pageview");
  // end google analytics

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
