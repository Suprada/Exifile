/* Exifile v1.0 - Free your Scribd highlights from the cloud
 * http://www.oddumbrella.com/exifile
 * Copyright (c) 2016 Suprada Urval <suprada@suprada.com> (http://www.suprada.com)
 * MIT Licensed*/
exifile = (function(){
    var metadat = {
      name: "exifile",
      version: "1.0",
        tagline: "Free your Scribd highlights from the cloud",
        description: "When you create highlights and notes when reading your Scribd books, there is no way to see them in one page or to download them. This bookmarklet helps you to excise and file those Scribd highlights.  It gives you a single clean page with all your notes and highlights which can be copies, and gives you the option to download it in plain text format or JSON format. The highlights and notes can also be downloaded in plain text or JSON format.",
        keywords: [ "scribd", "note", "highlight" ],
        author: "Suprada Urval <suprada@suprada.com> (http://www.suprada.com)",
        bugs: {
            email: "suprada@suprada.com"
        },
        homepage: "http://www.oddumbrella.com/exifile",
        license: "MIT",
    }
    /******* display downloading *********/
    var e = document.createElement("div");
    e.setAttribute('class','overlay-info');

    document.body.appendChild(e);
    var hostName = location.hostname;
    var readPath = location.pathname.split('/')[1];
    closeAll = function closeAll (elem){
      document.body.removeChild(elem);
    };
    if (hostName !== "www.scribd.com"){
      e.innerHTML = "<h1>Login to your book at www.scribd.com to start.</h1>";
      closeButton = document.createElement("div");
      closeButton.setAttribute("class","close-button-e");
      closeButton.innerHTML='<button onclick="document.body.removeChild(document.getElementsByClassName(\'overlay-info\')[0])" style="color: #000;background-color:  #fff;"">X</button>';
      e.appendChild(closeButton);
    } else if ((hostName === "www.scribd.com") && ( readPath !== 'read')){
      e.innerHTML = "<h1>Please start reading book</h1>";
      closeButton = document.createElement("div");
      closeButton.setAttribute("class","close-button-e");
      closeButton.innerHTML='<button onclick="document.body.removeChild(document.getElementsByClassName(\'overlay-info\')[0])" style="color: #000;background-color:  #fff;"">X</button>';
      e.appendChild(closeButton);
    } else if ((hostName === "www.scribd.com") && ( readPath === 'read')){
      e.innerHTML = "<h1>Downloading</h1>";

      /******* Change the display to vertical first so it can chunk *********/
      var readingModeElemArr = document.querySelectorAll('[data-action="change_reading_mode"]');
      var readingModeChanged = 0;
      var readingModeHandle = null;
      for( var index=0; index < readingModeElemArr.length; index++){
        var elem = readingModeElemArr[index];
        var elemClass = elem.getAttribute('class')
        var elemTrack = elem.getAttribute('data-track');
        //if data track is vertical and not selected
        if (elemTrack === 'vertical'){
          if (elemClass.indexOf('selected') === -1){
            //click on it
            elem.click();
            //click save button
            document.getElementsByClassName('flat_btn outline_btn apply_changes')[0].click();
          }
        }
      }

      /****** Initialize the highlights object ********/
      var highlight = {};
      highlight.title = document.title;
      highlight.authors = document.getElementsByClassName('share_pinterest_btn')[0].getAttribute('data-authors');
      highlight.isbn = document.querySelector('meta[property="books:isbn"]').getAttribute('content');
      highlight.highlights = [];
      highlight.quotes = {};

      /*******  Scrape the chunks for the highlights  and notes *********/
      var bookSectionsList = document.getElementsByClassName("reader_columns")[1].children;
      var numberOfChunks = bookSectionsList.length;
      if (numberOfChunks){
        var chunkNum = 0;
        function go(){
          bookSectionsList[chunkNum].scrollIntoView();
          scrapeHighlights(bookSectionsList[chunkNum]);
          if (chunkNum++ < (numberOfChunks-1)){
            setTimeout(go, 250);
          } else {
            /* scrape Notes*/
            scrapeNotes();
            showButtons();
          }
        }
        go();
      }

      function showButtons(){
        nameStub = "Scribd.Highlights_"+(highlight.title.split(' ').join('.'));
        jsonFile = JSON.stringify(highlight);

        overlay = document.createElement("main");
        overlay.setAttribute('class','overlay-results');

        //remove old div
        e.innerHTML = "Done Loading Highlights";
        document.body.removeChild(e);
        //add new ovelay div
        document.body.appendChild(overlay);

        //div for the titles
        overlayHeaderDiv = document.createElement("header");
        overlayHeaderDiv.setAttribute('class','header-style');
        /*overlayHeaderDiv.setAttribute("style",`display: inline-block;
                          width: 75%;`);*/
        overlay.appendChild(overlayHeaderDiv);

        //div for the download buttons
        overlayButtons = document.createElement("div");
        overlayButtons.setAttribute("class","buttons-header");

        overlay.appendChild(overlayButtons);

        overlayTitle = document.createElement("h2");
        overlayTitle.innerHTML = highlight.title;
        overlayHeaderDiv.appendChild(overlayTitle);

        overlayAuthor = document.createElement("h4");
        overlayAuthor.innerHTML = highlight.authors;
        overlayHeaderDiv.appendChild(overlayAuthor);

        overlayISBN = document.createElement("h4");
        overlayISBN.innerHTML = "ISBN: " + highlight.isbn;
        /*overlayISBN.style["padding-bottom"] = '20px';*/
        overlayHeaderDiv.appendChild(overlayISBN);


        jsonButton = document.createElement("span");
        jsonButton.innerHTML = '<button class="button-style" onclick="download((nameStub+\'.json\'),jsonFile)">Download JSON</button>';
        overlayButtons.appendChild(jsonButton);

        //create text filename and dom list
        textFile = '';
        displayText = '';
        //From quotes object
        for (keys in highlight){
          if (typeof highlight[keys] === 'object'){
            displayText += '<ol class="all-quotes">';
            //quotes object here iterate over them
            for(ids in highlight[keys]){
              textFile += '\n';
              displayText += '<li class="quote-style">';
              if (highlight[keys][ids].hasOwnProperty('text')){
                displayText += ('<span class="text">'+ highlight[keys][ids].text + '</span>');
                textFile+= highlight[keys][ids].text + '\n';
              }
              if (highlight[keys][ids].hasOwnProperty('note')){
                textFile+= "NOTE: "+ highlight[keys][ids].note+'\n';
                displayText += ('<br><span class="note">Note: '+ highlight[keys][ids].note + '</span>');
              }
              if (highlight[keys][ids].hasOwnProperty('location')){
                textFile+= "LOCATION: "+ highlight[keys][ids].location+'\n';
                displayText += ('<br><span class="page-number">Page: '+ highlight[keys][ids].location + '</span>');
              }
              displayText += '</li>'
            }
            displayText += '</ol>';

          } else {
            textFile += highlight[keys] + '\n';
          }
        }

        textButton = document.createElement("span");
        textButton.innerHTML = '<button style="padding: 10px; margin: 10px;" onclick="download((nameStub+\'.txt\'),textFile)">Download Text</button>';
        overlayButtons.appendChild(textButton);

        closeButton = document.createElement("div");
        closeButton.setAttribute("class","close-button");
        closeButton.innerHTML='<button onclick="closeAll()" style="color: #000;background-color:  #fff;"">X</button>';
        overlay.appendChild(closeButton);

        divText = document.createElement("div");
        divText.setAttribute('class','highlights-text');


        divText.innerHTML = displayText;
        overlay.appendChild(divText);
        footer = document.createElement("div");
        footer.setAttribute('class', 'exifile-footer');
        footer.innerHTML = "<p>Exifile by Suprada | Free your Scribd highlights</p>";
        overlay.appendChild(footer);
      }


      closeAll = function closeAll (){
        document.body.removeChild(overlay);
      };

      download = function download (filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      };

      function scrapeNotes(){
        var noteHandle = document.getElementsByClassName("highlight_note");
          if (noteHandle.length > 0){ //i.e there are some elements
            //get the note text
            for (var i = 0; i < noteHandle.length; i++){
              var text = noteHandle[i].innerHTML.split('</span>')[1].trim();
              var highId = noteHandle[i].parentNode.getAttribute("data-id");
              highlight.quotes[highId].note = text;
            }
          }
      }
      function scrapeHighlights( itemHandler){
        // get all highlight elements from the document chunk
        var x = itemHandler.getElementsByClassName('highlight highlight_highlight highlight_highlight');
        var pageInfo = document.getElementsByClassName('pages_info')[1];
        var pageNum = pageInfo.innerHTML;
        for( var i=0; i< x.length; i++){
          //List of all classes by classname
          var nodeClassList = x[i].getAttribute('class');
          //the highlight id associated with this element
          var highlightId = nodeClassList.split(':')[1];
          //the innerHTML with this element
          var nodeText = x[i].innerHTML;
          //if this id exists, append to the text
          //pushing into the highlight.quotes object
          var quoteElem;
          if (highlight.quotes[highlightId] === undefined){
            //add this.
            highlight.quotes[highlightId] = {
              "id": highlightId,
              "text": nodeText,
              "location": pageNum.split(' ')[1]
            }
          } else {
            //this highlight id exists
            // just update the node text
             highlight.quotes[highlightId].text += nodeText;
          }
        }
      }
    }
  })();

