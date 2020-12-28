## Local development instructions

1. Clone repo
2. Run `npm install` to install dependencies
3. For local development, you need to generate SSL keyr
   `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`
4. Run `npm run local`. This will start the https server to launch the bookmarklet and the index.html file
5. Go to localhost:9000
6. Drag the bookmark to your bookmark bar. Use this version for all your local development.
7. Run exifile while one page is still open at localhost:9000

## Build production

1. Run `npm run build`
2. The production files are created in the dist folder
3. In the index.html file in the distribution folder, remove the script tag with exifile.js (Fix this)
4. Copy to folder on server

<!-- For local testing and development


For local testing, the url for the javascript bookmarklet

javascript:void function(){(function(e){var t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href="https://127.0.0.1:8080/exifile.css",document.body.appendChild(t);var s=document.createElement("script");s.setAttribute("src",e),document.body.appendChild(s)})("https://127.0.0.1:8080/exifile.js")}(); -->
