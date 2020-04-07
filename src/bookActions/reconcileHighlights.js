import { showHighlightsWithButtons } from "../components/showHighlightsWithButtons";

export const reconcileHighlights = (highlights, bookHighlights) => {
  // console.log("highlights.annotations", highlights.annotations);
  console.log("Num of bookHighlights", bookHighlights.length);
  const newAnnotations = [];
  highlights.annotations.reverse().forEach((item, ind) => {
    if (bookHighlights[ind]) {
      item.excerpt = bookHighlights[ind].text;
      newAnnotations.push(item);
    }
  });
  highlights.annotations = newAnnotations;

  showHighlightsWithButtons(highlights);
};
