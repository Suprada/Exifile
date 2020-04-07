import { addOverlayHeader, addFooter } from "./overlay";
import { addFillButtonsHeader, addCloseButton } from "./buttons";
import { createTextFile } from "../downloads/createTextFile";

export const showHighlightsWithButtons = (highlights) => {
  const e = document.getElementsByClassName("overlay-info")[0];
  const overlay = document.createElement("main");
  overlay.setAttribute("class", "overlay-results");

  // remove old div
  e.innerHTML = "Done Loading Highlights";
  document.body.removeChild(e);

  // add new ovelay div
  document.body.appendChild(overlay);

  addOverlayHeader({ parentEl: overlay, highlights });

  addFillButtonsHeader({
    parentEl: overlay,
    highlights,
  });

  addCloseButton(overlay);

  // show highlights
  const obj = createTextFile(highlights);
  const displayText = obj.displayText;
  const divText = document.createElement("div");
  divText.setAttribute("class", "highlights-text");

  divText.innerHTML = displayText;
  overlay.appendChild(divText);
  addFooter(overlay);
};
