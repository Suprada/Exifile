import { updatePollingCounter } from "../components/overlay";
import { scrapeCurrentPage } from "./scrapeCurrentPage";
import { waitForChapterToLoad } from "../util";

export const readBook = async (highlights, lastPage, chapterNames) => {
  // console.log("in readbook. lastPage is", lastPage);
  let currentPage = 1;
  let highlightsObj = {};
  let cntr = 1;
  let nb1 = [];
  let nb2 = [];
  let t = {};
  let quitLoop = false;
  console.log("Reading book now", currentPage, lastPage, quitLoop);
  // scroll through pages and scrape each page.
  while (!isNaN(currentPage) && currentPage < lastPage && quitLoop === false) {
    cntr++;
    t = await scrapeCurrentPage();
    currentPage = t.currentPage;
    const chapterHeading = document.getElementsByClassName(
      "visually_hidden chapter_title_heading"
    )[0].innerText;
    const pollingMsg = `In chapter: <em>${chapterHeading}</em>. Loop ${cntr}</In>`;
    await updatePollingCounter(pollingMsg);
    highlightsObj = Object.assign(highlightsObj, t.scrapedHighlights);
    nb1 = document.getElementsByClassName("only_next_btn");
    nb2 = document.getElementsByClassName("load_next_btn");
    const numChapters = chapterNames.length;
    if (nb1 && nb1.length > 0) {
      nb1[0].scrollIntoView();
      nb1[0].getElementsByTagName("button")[0].click();
      await waitForChapterToLoad(chapterHeading);
    } else if (
      nb2 &&
      nb2.length > 0 &&
      chapterHeading !== chapterNames[numChapters - 1]
    ) {
      nb2[0].scrollIntoView();
      nb2[0].click();
      await waitForChapterToLoad(chapterHeading, currentPage);
    } else {
      console.log("quitting loop");
      quitLoop = true;
    }
  }
  console.log("highlightsObj is", highlightsObj);
  return highlightsObj;
};
