import { getBookMeta } from "./getBookMeta";
import { goToCoverPage } from "./goToCoverPage";
import { getNotesAndBookmarks } from "./getNotesAndBookmarks";
import { addCloseButton } from "../components/buttons";
import { updateOverlayMessage } from "../components/overlay";
import { getLastPage } from "../pageActions/getLastPage";
import { readBook } from "../bookActions/readBook";
import { reconcileHighlights } from "../bookActions/reconcileHighlights";

export const startScrapingPage = async () => {
  let highlights = {};
  highlights = getBookMeta(highlights);
  const chapterNames = await goToCoverPage();

  highlights.annotations = await getNotesAndBookmarks();
  updateOverlayMessage(
    `Found ${highlights.annotations.length} annotations in ${highlights.title}`
  );
  console.log(
    `Found ${highlights.annotations.length} annotations in ${highlights.title}`
  );
  if (highlights.annotations) {
    const lastPage = await getLastPage(highlights.annotations);
    let bookHighlights = await readBook(highlights, lastPage, chapterNames);
    const keys = Object.keys(bookHighlights);
    const updated = keys.map((item) => {
      const { id, text } = bookHighlights[item];
      const t = {};
      t.id = id;
      t.text = text.join(" ");
      return t;
    });
    // reconcile highlights and bookHighlights
    reconcileHighlights(highlights, updated);
  } else {
    console.log("no annotations found");
    e.innerHTML = `<h1>Exifile</h1><h2>This book has no highlights.</h2>`;
    addCloseButton(e);
  }
};
