export const createTextFile = (highlights) => {
  // console.log("highlights", highlights);
  const { title, authors, isbn, annotations } = highlights;
  let textFile = "";
  let displayText = "";
  // From quotes object
  displayText += '<ol class="all-quotes">';
  textFile += "TITLE: " + title + "\n";
  textFile += "AUTHORS: " + authors.join(", ") + "\n";
  textFile += "ISBN: " + isbn + "\n";

  annotations.forEach((item) => {
    textFile += "\n";
    displayText += '<li class="quote-style">';
    if (item.type === "highlight") {
      displayText += '<span class="text">' + item.excerpt + "</span>";
      textFile += item.excerpt + "\n";
    } else if (item.type === "note") {
      textFile += "NOTE: " + item.excerpt + "\n";
      displayText += '<br><span class="note">Note: ' + item.excerpt + "</span>";
    }
    textFile += "LOCATION: " + item.location + "\n";
    displayText += '<br><span class="page-number">' + item.location + "</span>";
    displayText += "</li>";
  });
  displayText += "</ol>";
  return { textFile: textFile, displayText: displayText };
};
