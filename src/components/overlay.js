import { addCloseButton } from "./buttons";

const UPDATED_DATE = "April 11, 2020";
const h1Message = `Exifiling...`;
const h1Elem = `<h1 id="exifile-h1">${h1Message}</h1>`;
const h3Message = `Takes about 5 mins-ish. Time for a cup of coffee...`;
const h3Elem = `<h3 id='exifile-h3'>${h3Message}</h3>`;
const message1 = `Starting Exifiling.`;
const progressElem = `<p id='exifile-progress'>${message1}</p>`;

const pollingMessage = ``;
const pollingElem = `<span id='exifile-polling'>${pollingMessage}</span>`;
const pollingSpan = `<span id='polling'></span>`;

const updatedOnMessage = `Exifile updated on ${UPDATED_DATE}`;
const updatedElem = `<p class='updatedOn'>${updatedOnMessage}</p>`;

export const makeOverlayAndSetMessage = (e, hostName, readPath) => {
  return new Promise(resolve => {
    e.setAttribute("class", "overlay-info");
    document.body.appendChild(e);
    if (hostName !== "www.scribd.com") {
      e.innerHTML = "<h1>Login to your book at www.scribd.com to start.</h1>";
      addCloseButton(e);
      resolve();
    } else if (hostName === "www.scribd.com" && readPath !== "read") {
      e.innerHTML = "<h1>Please start reading book</h1>";
      addCloseButton(e);
      resolve();
    } else if (hostName === "www.scribd.com" && readPath === "read") {
      e.innerHTML = `${h1Elem}${h3Elem}${progressElem}<p>${pollingElem} ${pollingSpan}</p>${updatedElem}`;
      resolve();
    }
  });
};

export const updateOverlayMessage = msg => {
  return new Promise(resolve => {
    const overlayInfo = document.getElementById("exifile-progress");
    const currentMsg = overlayInfo.innerText;
    overlayInfo.innerHTML = `${currentMsg} ${msg}`;
  });
};

export const updatePollingCounter = msg => {
  return new Promise(resolve => {
    const pollingCntr = document.getElementById("exifile-polling");
    pollingCntr.innerHTML = msg;
    resolve();
  });
};

export const addOverlayHeader = ({ parentEl, highlights }) => {
  // div for the titles
  const overlayHeaderDiv = document.createElement("header");
  overlayHeaderDiv.setAttribute("class", "header-style");
  parentEl.appendChild(overlayHeaderDiv);

  const overlayTitle = document.createElement("h2");
  overlayTitle.innerHTML = highlights.title;
  overlayHeaderDiv.appendChild(overlayTitle);

  const overlayAuthor = document.createElement("h4");
  overlayAuthor.innerHTML = highlights.authors;
  overlayHeaderDiv.appendChild(overlayAuthor);

  const overlayISBN = document.createElement("h4");
  overlayISBN.innerHTML = "ISBN: " + highlights.isbn;
  overlayHeaderDiv.appendChild(overlayISBN);

  return null;
};

export const addFooter = parentEl => {
  const footer = document.createElement("div");
  footer.setAttribute("class", "exifile-footer");
  footer.innerHTML =
    "<p><a href='https://oddumbrella.com/exifile/Exifile' target='_blank' rel='noopener noreferrer'>Exifile</a> by Suprada | Free your Scribd highlights</p>";
  parentEl.appendChild(footer);
  return null;
};
