1. Run `npm run dev`
2. Go to localhost:9000
3. Drag the bookmark
4. Run exifile while one page is still open at localhost:9000

To deploy

1. Run npm run build
2. The production files live in the dist folder
3. In the index.html file remove the script tag with exifile.js
4. Copy to folder on server

<!-- For local testing and development

1. Launch the local http server
   ` npm run server`
2. Navigate to the index-local.html in your browser
   `https://127.0.0.1:8080/index-local.html`
3. Pull the bookmarklet onto you bar
4/ Need to run https locally. To generate certificate use this:
   https://codeburst.io/running-local-development-server-on-https-c3f80197ac4f

For local testing, the url for the javascript bookmarklet

javascript:void function(){(function(e){var t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href="https://127.0.0.1:8080/exifile.css",document.body.appendChild(t);var s=document.createElement("script");s.setAttribute("src",e),document.body.appendChild(s)})("https://127.0.0.1:8080/exifile.js")}(); -->
