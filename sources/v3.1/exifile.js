// TODO failing when full screen
// todo intermittent infinite loop
// TODO modules howto
// TODO clean up code
/* Exifile v3.0 - Free your Scribd highlights from the cloud
 * http://www.oddumbrella.com/exifile
 * Copyright (c) 2016 Suprada Urval <suprada@.oddumbrella.com> (https://oddumbrella.com)
 * MIT Licensed*/

exifile = (function() {
  const metadat = {
    name: "exifile",
    version: "2.0",
    tagline: "Free your Scribd highlights from the cloud",
    description:
      "When you create highlights and notes when reading your Scribd books, there is no way to see them in one page or to download them. This bookmarklet helps you to excise and file those Scribd highlights.  It gives you a single clean page with all your notes and highlights which can be copies, and gives you the option to download it in plain text format or JSON format. The highlights and notes can also be downloaded in plain text or JSON format.",
    keywords: ["scribd", "note", "highlight"],
    author: "Suprada Urval <suprada@oddumbrella.com> (https://oddumbrella.com)",
    bugs: {
      email: "suprada@oddumbrella.com"
    },
    homepage: "https://oddumbrella.com/exifile",
    license: "MIT"
  };

  // TODO add analytics tracker
  const e = document.createElement("div");
  const hostName = location.hostname;
  const readPath = location.pathname.split("/")[1];
  let verticalScrolling = false;
  let highlights = {};
  let bookHighlights = {};
  let anns = [];

  initExifile();

  function initExifile() {
    makeOverlayAndSetMessage(e);
    verticalScrolling =
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
  }

  function makeOverlayAndSetMessage(e) {
    // console.log("in makeOverlayAndSetMessage");
    e.setAttribute("class", "overlay-info");
    document.body.appendChild(e);
    if (hostName !== "www.scribd.com") {
      e.innerHTML = "<h1>Login to your book at www.scribd.com to start.</h1>";
      addCloseButton(e);
    } else if (hostName === "www.scribd.com" && readPath !== "read") {
      e.innerHTML = "<h1>Please start reading book</h1>";
      addCloseButton(e);
    } else if (hostName === "www.scribd.com" && readPath === "read") {
      e.innerHTML =
        "<h1>Exifiling...</h1><h3>Takes about 5 mins-ish. Time for a cup of coffee...</h3><p id='exifiling-status'>Starting Exifiling... <span id='polling'></span></p><p className='updatedOn'>Exifile updated on March 13, 2020</p>";
    }
  }

  async function startScrapingPage() {
    highlights = getBookMeta(highlights);
    const numChapters = goToCoverPage();
    highlights.annotations = await getNotesAndBookmarks();
    // console.log("notes are", highlights.annotations);
    if (highlights.annotations) {
      const lastPage = getLastPage(highlights.annotations);
      let t = await timeout(2000);
      let bookHighlights = await readBook(lastPage, numChapters);
      const keys = Object.keys(bookHighlights);
      const updated = keys.map(item => {
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
  }

  function reconcileHighlights(highlights, bookHighlights) {
    // console.log("highlights.annotations", highlights.annotations);
    const newAnnotations = highlights.annotations.reverse().map((item, ind) => {
      item.excerpt = bookHighlights[ind].text;
      return item;
    });
    highlights.annotations = newAnnotations;

    showHighlightsWithButtons(e, highlights);
  }

  function getBookMeta(obj) {
    // TODO handle multiple author names
    const { title, author_name } = Scribd.current_doc;
    obj.isbn = document
      .querySelector('meta[property="books:isbn"]')
      .getAttribute("content");
    obj.title = title;
    obj.authors = [author_name];
    return obj;
  }

  async function waitForAnnotations() {
    let emptyModal = null;
    let annotations = null;
    let elem = null;
    return new Promise(async resolve => {
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
  }

  async function getNotesAndBookmarks() {
    // console.log('in getNotesAndAnnotations');
    let annotations = [];
    // click on notes and bookmarks
    document
      .getElementsByClassName("icon-ic_overflowmenu")[0]
      .parentElement.click(); // expand overflow menu
    document
      .getElementsByClassName("icon-ic_notebook")[0]
      .parentElement.click(); // click on Notes & Bookmarks
    await waitForAnnotations();

    // scrape annotations from the highlights modal
    const items = document.getElementsByClassName("annotation");
    if (items.length > 0) {
      for (let item of items) {
        const location = item.getElementsByClassName("page_num")[0].innerHTML;
        const type = item.getElementsByClassName("annotation_type")[0]
          .innerHTML;
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
            excerpt: excerpt
          });
        }
      }
      closeModal();
      return annotations;
    }
    closeModal();
    console.log("no notes and bookmarks available in this book");
    return null;
  }

  const closeModal = () => {
    // console.log("in close modal");
    const closeBtn =
      document.getElementsByClassName("icon-ic_close") &&
      document.getElementsByClassName("icon-ic_close_small");
    if (closeBtn.length > 0) {
      ("in closing");
      closeBtn[0].click();
    }
  };

  function getLastPage(annotations) {
    // console.log(
    //   "in getLastPage. Not real last page but last page for rendering"
    // );
    const lastPage = document
      .getElementById("footer")
      .innerText.split(" ")[3]
      .split(",")[0];

    return Number(lastPage);
  }

  function goToCoverPage() {
    // console.log("in goToCoverPage");
    /******* Go to Table of Contents and go to the first page of the book *********/
    const tocIcon = document.getElementsByClassName("icon-ic_toc_list");
    tocIcon[0].click();
    const tocParentDiv = tocIcon[0].parentElement.parentElement;
    const tocList = tocParentDiv.querySelector("ul");
    const chapters = tocList.querySelectorAll("li");
    let chapterNames = [];
    chapters.forEach(item => {
      chapterNames.push(item.querySelector("span").innerText);
    });
    // go to the first item in the menu
    tocList.children[0].click();
    return chapterNames;
  }

  async function readBook(lastPage, chapterNames) {
    // console.log("in readbook. lastPage is", lastPage);
    let currentPage = 1;
    let highlightsObj = {};
    let cntr = 1;
    let nb1 = [];
    let nb2 = [];
    let t = {};
    let quitLoop = false;

    // scroll through pages and scrape each page.
    while (
      !isNaN(currentPage) &&
      currentPage < lastPage &&
      quitLoop === false
    ) {
      cntr++;
      t = scrapeCurrentPage();
      currentPage = t.currentPage;
      const statusEl = document.getElementById("exifiling-status");
      const chapterHeading = document.getElementsByClassName(
        "visually_hidden chapter_title_heading"
      )[0].innerText;
      statusEl.innerHTML = `<p>Book: ${
        highlights.title
      }</p> <p>In <em>${chapterHeading}</em></p> <p> Loop ${cntr} <span id="polling"></span></p>`;
      // (Page ${currentPage} of ${lastPage})
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
    return highlightsObj;
  }

  async function waitForChapterToLoad(chapterHeading, currentPage) {
    let currentChapterHeading = chapterHeading;
    let currentPageAfterLoad = currentPage;
    let awaitCntr = 0;
    const pollEl = document.getElementById("polling");
    let pollDuration = awaitCntr * 300;
    return new Promise(async (resolve, reject) => {
      // quit polling if
      // chapter name has changed
      // or currentPageNumber has changed
      // or we are stuck for some reason, timeout of 4000ms or more
      while (
        currentChapterHeading === chapterHeading &&
        currentPage === currentPageAfterLoad &&
        awaitCntr * 300 < 4000
      ) {
        awaitCntr++;
        let t = await timeout(300);
        let m = 4000 - awaitCntr * 300;
        pollEl.innerHTML = `(${m}ms left)`;
        currentChapterHeading = document.getElementsByClassName(
          "visually_hidden chapter_title_heading"
        )[0].innerText;
        currentPageAfterLoad = Number(
          document.getElementById("footer").innerText.split(" ")[1]
        );
      }
      resolve(true);
    });
  }

  function scrapeCurrentPage() {
    scrollDownPage();
    const scrapedHighlights = scrapeHighlights();
    const currentPage = Number(
      document.getElementById("footer").innerText.split(" ")[1]
    );
    const t = {
      scrapedHighlights: scrapedHighlights,
      currentPage: currentPage
    };
    return t;
  }

  function scrapeHighlights() {
    // console.log('in scrapeHighlights');
    let pageHighlights = {};
    const elems = document.getElementsByClassName("highlight");
    if (elems.length > 0) {
      for (let el of elems) {
        const id = el.className.split(":")[1];
        if (pageHighlights[id]) {
          pageHighlights[id].text.push(el.innerHTML);
        } else {
          pageHighlights[id] = { id: id, text: [el.innerHTML] };
        }
      }
      return pageHighlights;
    }
    return null;
  }

  function showHighlightsWithButtons(e, highlights) {
    overlay = document.createElement("main");
    overlay.setAttribute("class", "overlay-results");

    // remove old div
    e.innerHTML = "Done Loading Highlights";
    document.body.removeChild(e);

    // add new ovelay div
    document.body.appendChild(overlay);

    addOverlayHeader({ parentEl: overlay, highlights });

    addFillButtonsHeader({
      parentEl: overlay,
      highlights
    });

    addCloseButton(overlay);

    // show highlights
    obj = createTextFile(highlights);
    displayText = obj.displayText;
    divText = document.createElement("div");
    divText.setAttribute("class", "highlights-text");

    divText.innerHTML = displayText;
    overlay.appendChild(divText);
    addFooter(overlay);
  }

  const addOverlayHeader = ({ parentEl }) => {
    // div for the titles
    overlayHeaderDiv = document.createElement("header");
    overlayHeaderDiv.setAttribute("class", "header-style");
    overlay.appendChild(overlayHeaderDiv);

    overlayTitle = document.createElement("h2");
    overlayTitle.innerHTML = highlights.title;
    overlayHeaderDiv.appendChild(overlayTitle);

    overlayAuthor = document.createElement("h4");
    overlayAuthor.innerHTML = highlights.authors;
    overlayHeaderDiv.appendChild(overlayAuthor);

    overlayISBN = document.createElement("h4");
    overlayISBN.innerHTML = "ISBN: " + highlights.isbn;
    overlayHeaderDiv.appendChild(overlayISBN);

    return null;
  };

  const addFillButtonsHeader = ({ parentEl, highlights }) => {
    overlayButtons = document.createElement("div");
    overlayButtons.setAttribute("class", "buttons-header");
    parentEl.appendChild(overlayButtons);

    nameStub = "Exifile.Highlights_" + highlights.title.split(" ").join(".");
    obj = createTextFile(highlights);
    textFile = obj.textFile;
    jsonFile = JSON.stringify(highlights);

    addDownloadButton({
      parentEl: overlayButtons,
      stub: nameStub,
      file: jsonFile,
      type: "JSON"
    });
    addDownloadButton({
      parentEl: overlayButtons,
      stub: nameStub,
      file: textFile,
      type: "Text"
    });

    // TODO add subscribe here

    return null;
  };

  const addDownloadButton = ({ parentEl, stub, file, type }) => {
    downloadButton = document.createElement("button");
    downloadButton.setAttribute("class", "download-button");
    downloadButton.innerHTML = `Download ${type}`;
    downloadButton.onclick = () => download(`${stub}.${type}`, file);
    parentEl.appendChild(downloadButton);
    return null;
  };

  const addCloseButton = parentEl => {
    closeButton = document.createElement("button");
    closeButton.setAttribute("class", "close-button");
    closeButton.innerHTML = "X";
    closeButton.onclick = () => closeAll(parentEl);
    parentEl.appendChild(closeButton);
    return null;
  };

  const addFooter = parentEl => {
    footer = document.createElement("div");
    footer.setAttribute("class", "exifile-footer");
    footer.innerHTML =
      "<p><a href='https://oddumbrella.com/exifile/Exifile' target='_blank' rel='noopener noreferrer'>Exifile</a> by Suprada | Free your Scribd highlights</p>";
    parentEl.appendChild(footer);
    return null;
  };

  function createTextFile(highlights) {
    // console.log("highlights", highlights);
    const { title, authors, isbn, annotations } = highlights;
    textFile = "";
    displayText = "";
    // From quotes object
    displayText += '<ol class="all-quotes">';
    textFile += "TITLE: " + title + "\n";
    textFile += "AUTHORS: " + authors.join(", ") + "\n";
    textFile += "ISBN: " + isbn + "\n";

    annotations.forEach(item => {
      textFile += "\n";
      displayText += '<li class="quote-style">';
      if (item.type === "highlight") {
        displayText += '<span class="text">' + item.excerpt + "</span>";
        textFile += item.excerpt + "\n";
      } else if (item.type === "note") {
        textFile += "NOTE: " + item.excerpt + "\n";
        displayText +=
          '<br><span class="note">Note: ' + item.excerpt + "</span>";
      }
      textFile += "LOCATION: " + item.location + "\n";
      displayText +=
        '<br><span class="page-number">' + item.location + "</span>";
      displayText += "</li>";
    });
    displayText += "</ol>";
    return { textFile: textFile, displayText: displayText };
  }

  function scrollDownPage() {
    // console.log("in scrollDownPage");
    const verticalPages = document.getElementsByClassName("vertical_page");
    verticalPages[verticalPages.length - 1].scrollIntoView();
    var buttonsContainer = document.getElementsByClassName("buttons_container");
    buttonsContainer[0].scrollIntoView();
    // console.log("done scroll down page");
  }

  download = function download(filename, text) {
    // console.log("in download");
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // DOM helpers
  closeAll = function(elem) {
    // console.log("in closeAll");
    document.body.removeChild(elem);
  };

  // helpers
  async function delayTimer(f, n) {
    await timeout(n);
    return f();
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();
