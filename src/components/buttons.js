import { createTextFile } from "../downloads/createTextFile";

export const addFillButtonsHeader = ({ parentEl, highlights }) => {
  const overlayButtons = document.createElement("div");
  overlayButtons.setAttribute("class", "buttons-header");
  parentEl.appendChild(overlayButtons);

  const nameStub =
    "Exifile.Highlights_" + highlights.title.split(" ").join(".");
  const obj = createTextFile(highlights);
  const textFile = obj.textFile;
  const jsonFile = JSON.stringify(highlights);

  addDownloadButton({
    parentEl: overlayButtons,
    stub: nameStub,
    file: jsonFile,
    type: "JSON",
  });
  addDownloadButton({
    parentEl: overlayButtons,
    stub: nameStub,
    file: textFile,
    type: "Text",
  });

  // TODO add subscribe here

  return null;
};

export const addCloseButton = (parentEl) => {
  const closeButton = document.createElement("button");
  closeButton.setAttribute("class", "close-button");
  closeButton.innerHTML = "X";
  closeButton.onclick = () => closeAll(parentEl);
  parentEl.appendChild(closeButton);
  return null;
};

export const addDownloadButton = ({ parentEl, stub, file, type }) => {
  const downloadButton = document.createElement("button");
  downloadButton.setAttribute("class", "download-button");
  downloadButton.innerHTML = `Download ${type}`;
  downloadButton.onclick = () => download(`${stub}.${type}`, file);
  parentEl.appendChild(downloadButton);
  return null;
};

const download = function download(filename, text) {
  // console.log("in download");
  const element = document.createElement("a");
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

const closeAll = function(elem) {
  // console.log("in closeAll");
  document.body.removeChild(elem);
};
