export const bookmarklet = mode => {
  let hostPath = "https://127.0.0.1:8080/";
  if (mode === "production") {
    hostPath =
      "https://secure27.webhostinghub.com/~suprad5/oddumbrella/exifile/latest/";
  }

  const formFunction = hostPath => {
    return function(e) {
      var t = document.createElement("link");
      (t.rel = "stylesheet"),
        (t.type = "text/css"),
        (t.href = `${hostPath}exifile.css`),
        document.body.appendChild(t);
      var s = document.createElement("script");
      s.setAttribute("src", e), document.body.appendChild(s);
    };
  };
  const returnString = `javascript: void (function() {${formFunction.toString()}
  ()("https://127.0.0.1:8080/dist/exifile.js");
})();`;
};
