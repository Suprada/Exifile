const { closeModal } = require("../components/closeModal");
const { timeout } = require("../util");

export const getNotesAndBookmarks = async () => {
  //   console.log("in getNotesAndAnnotations");
  let annotations = [];
  // click on notes and bookmarks
  document
    .getElementsByClassName("icon-ic_overflowmenu")[0]
    .parentElement.click(); // expand overflow menu
  document.getElementsByClassName("icon-ic_notebook")[0].parentElement.click(); // click on Notes & Bookmarks
  await waitForAnnotations();
  // scrape annotations from the highlights modal
  const items = document.getElementsByClassName("annotation");
  if (items.length > 0) {
    for (let item of items) {
      const location = item.getElementsByClassName("page_num")[0].innerHTML;
      const type = item.getElementsByClassName("annotation_type")[0].innerHTML;
      const time = item.getElementsByClassName("time")[0].innerHTML;
      const excerpt = item.getElementsByClassName("excerpt")[0].innerHTML;
      if (
        excerpt &&
        excerpt !== "" &&
        excerpt !== "No preview available" &&
        type === "highlight"
      ) {
        annotations.push({
          location: location,
          type: type,
          time: time,
          excerpt: excerpt,
        });
      }
    }
    closeModal();
    return annotations;
  }
  closeModal();
  console.log("no notes and bookmarks available in this book");
  return null;
};

const waitForAnnotations = () => {
  let emptyModal = null;
  let annotations = null;
  let elem = null;
  return new Promise(async (resolve) => {
    // poll for notebook_modal to load
    while (elem === null || elem.length === 0) {
      elem = document.getElementById("notebook_modal");
      await timeout(300);
    }
    while (
      emptyModal === null &&
      (annotations === null || annotations.length === 0)
    ) {
      // poll for annotations or empty modal
      annotations = elem.getElementsByClassName("annotation");
      emptyModal = elem.getElementsByClassName("empty_notebook");
      await timeout(300);
    }
    resolve(true);
  });
};
