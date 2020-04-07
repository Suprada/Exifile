export const getBookMeta = (highlights) => {
  // TODO handle multiple author names
  const { title, author_name } = Scribd.current_doc;
  highlights.isbn = document
    .querySelector('meta[property="books:isbn"]')
    .getAttribute("content");
  highlights.title = title;
  highlights.authors = [author_name];
  return highlights;
};
