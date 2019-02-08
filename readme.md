For local testing and development

- use the test-html file to generate the bookmarklet

(edit the bookmarklet with

)

1. Change the location in the javascript bookmarklet
   javascript:void function(){(function(e){var t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href="https://secure27.webhostinghub.com/~suprad5/oddumbrella/exifile/latest/exifile.min.css",document.body.appendChild(t);var s=document.createElement("script");s.setAttribute("src",e),document.body.appendChild(s)})("https://127.0.0.1:8080/exifile-test.js")}();

2) Launch the local http server
   npm run server

3) Need to run https locally. To generate certificate use this:
   https://codeburst.io/running-local-development-server-on-https-c3f80197ac4f
