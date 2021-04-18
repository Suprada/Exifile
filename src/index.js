// TODO failing when full screen
// todo intermittent infinite loop
// TODO modules howto
// TODO clean up code
/* Exifile v3.0 - Free your Scribd highlights from the cloud
 * http://www.suprada.com/exifile
 * Copyright (c) 2016 Suprada Urval <exifile@suprada.com> (https://suprada.com/exifile)
 * MIT Licensed*/

const { makeOverlayAndSetMessage } = require("./components/overlay");
const { initExifile } = require("./initExifile");
const { waitByElementId, waitByElemClass } = require("./util");
import "./exifile.css";

exifile = (async function() {
  const buildTime = process.env.buildTime;

  const metadat = {
    name: "exifile",
    version: "2.0",
    tagline: "Free your Scribd highlights from the cloud",
    description:
      "When you create highlights and notes when reading your Scribd books, there is no way to see them in one page or to download them. This bookmarklet helps you to excise and file those Scribd highlights.  It gives you a single clean page with all your notes and highlights which can be copies, and gives you the option to download it in plain text format or JSON format. The highlights and notes can also be downloaded in plain text or JSON format.",
    keywords: ["scribd", "note", "highlight"],
    author: "Suprada Urval <exifile@suprada.com> (https://suprada.com/exifile)",
    bugs: {
      email: "exifile@suprada.com"
    },
    homepage: "https://suprada.com/exifile",
    license: "MIT"
  };

  // TODO add analytics tracker
  const e = document.createElement("div");
  const hostName = location.hostname;
  const readPath = location.pathname.split("/")[1];
  let verticalScrolling = false;
  let bookHighlights = {};
  let anns = [];

  await makeOverlayAndSetMessage(e, hostName, readPath, buildTime);
  initExifile(e);
})();
