import { showHighlightsWithButtons } from "../components/showHighlightsWithButtons";
import he from "he";

export const reconcileHighlights = (highlights, bookHighlights) => {
  // console.log("highlights.annotations", highlights.annotations);
  const combined = [];
  const locationMap = {};
  const notesFromAnnotations = [];
  const notesFrombookHighlights = [];

  const mapBookHighlightsText = bookHighlights.map(item => {
    const text = item.text;
    return { [text]: item };
  });
  const mapHighlightAnnotations = highlights.annotations.map(item => {
    const excerpt = item.excerpt.split();
    let decodedExcerpt = excerpt.split("↵").join(" ");
    decodedExcerpt = he.decode(item.excerpt);
    console.log("decodedExcerpt is anno ", decodedExcerpt);

    return { [excerpt]: item };
  });

  // console.log("mapBookHighlightsText", mapBookHighlightsText);
  // console.log("mapHighlightAnnotationsText", mapHighlightAnnotations);
  // debugger;

  // rearrange notes and highlights
  // note text is found only in the "Notes & Bookmarks" overlay, with page number - bookhighlights
  // the highlighted text for the note is only found by scraping the page - highlights

  // the only way to match them is by comparing page numbers (and maybe time?) lets see if that works

  // when you make a note, only the note is saved - the corresponding text highlighted is not saved / not found in annotations
  // Also, they are embedded at the end
  // re-arrange the array before printing so that the notes get moved to the right places
  highlights.annotations.reverse().forEach((item, ind) => {
    // console.log("bookHighlights[ind] are", ind, bookHighlights[ind], item);
    if (bookHighlights[ind]) {
      item.excerpt = bookHighlights[ind].text;
      combined.push(item);
      const currLocation = item.location;
      if (locationMap[currLocation]) {
        locationMap[currLocation].push(ind);
      } else {
        locationMap[currLocation] = [ind];
      }
    }
  });
  let finalAnnotations = [];
  let positionShifter = 0;
  Object.keys(locationMap).forEach(pgNo => {
    locationMap[pgNo].forEach(anno => {
      if (combined[Number(anno)]) {
        finalAnnotations.push(combined[Number(anno)]);
      }
    });
  });
  highlights.annotations = finalAnnotations;

  showHighlightsWithButtons(highlights);
};
