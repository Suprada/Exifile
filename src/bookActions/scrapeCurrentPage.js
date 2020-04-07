const { scrollDownPage } = require("./scrollDownPage");
const { scrapeHighlights } = require("./scrapeHighlights");

export const scrapeCurrentPage = () => {
  return new Promise(async (resolve) => {
    scrollDownPage();
    const scrapedHighlights = scrapeHighlights();
    const currentPage = Number(
      document.getElementById("footer").innerText.split(" ")[1]
    );
    const t = {
      scrapedHighlights: scrapedHighlights,
      currentPage: currentPage,
    };
    resolve(t);
  });
};
