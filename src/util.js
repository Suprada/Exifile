async function waitByElementId(elemId) {
  let elem = null;
  let awaitCntr = 0;
  return new Promise(async (resolve) => {
    while (elem === null || elem.length === 0) {
      elem = document.getElementById(elemId);
      console.log(`Time elapsed to find ${elemId}: ${awaitCntr * 300}ms`);
      awaitCntr++;
      await timeout(300);
    }
    resolve(true);
  });
}

async function waitByElemClass(elemClass) {
  let elem = null;
  let awaitCntr = 0;
  return new Promise(async (resolve) => {
    while (elem === null || elem.length === 0) {
      elem = document.getElementsByClassName(elemClass);
      console.log(`Time elapsed to find ${elemClass}: ${awaitCntr * 300}ms`);
      awaitCntr++;
      await timeout(300);
    }
    resolve(true);
  });
}

async function delayTimer(f, n) {
  await timeout(n);
  return f();
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

module.exports = {
  waitByElementId,
  waitByElemClass,
  timeout,
  delayTimer,
  waitForChapterToLoad,
};
