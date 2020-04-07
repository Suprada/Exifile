const { waitByElemClass, waitForChapterToLoad } = require("../util");

export const goToCoverPage = () => {
  return new Promise(async (resolve) => {
    const tocIcon = document.getElementsByClassName("icon-ic_toc_list");
    tocIcon[0].click();
    // TODO wait till you see "menu_heading visually_hidden"
    await waitByElemClass("menu_heading visually_hidden");

    const coverPageMenu = document.getElementsByClassName(
      "menu_heading visually_hidden"
    );

    const coverPageMenuItems = coverPageMenu[0].parentElement;
    const tocList = coverPageMenuItems.querySelector("ul");
    const chapters = tocList.querySelectorAll("li");
    let chapterNames = [];
    chapters.forEach((item) => {
      chapterNames.push(item.querySelector("span").innerText);
    });
    // go to the first item in the menu
    tocList.children[0].click();
    const chapterHeading = document.getElementsByClassName(
      "visually_hidden chapter_title_heading"
    )[0].innerText;
    await waitForChapterToLoad(chapterHeading);
    
    resolve(chapterNames);
  });
};
