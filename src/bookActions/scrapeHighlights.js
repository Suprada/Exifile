export const scrapeHighlights = () => {
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
};
