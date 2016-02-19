// this is the way scribd marks its highlights
// <span class="highlight highlight_highlight highlight_highlight:5191914 selected">is</span>

function initExifile() {
  (window.exifile = function(){
    /******* display downloading *********/
    e = document.createElement("div");
    e.setAttribute('class','overlay-info');
    e.setAttribute('style',`padding: 20px;
                     margin: 0;
                     color: #000;
                     background-color:rgba(240,240,255,0.75);
                     font-size: 50px;
                     position: fixed;
                     top: 20%;
                     right: auto;
                     left: auto;
                     width: 80%;
                     text-align: center;`);
    e.innerHTML = "Downloading";
    document.body.appendChild(e);

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

    /*******  Scrape the chunks for the highlights *********/
    var bookSectionsList = document.getElementsByClassName("reader_columns")[1].children;
    var numberOfChunks = bookSectionsList.length;
    if (numberOfChunks){
      var chunkNum = 0;
      function go(){
        bookSectionsList[chunkNum].scrollIntoView({block: "end", behavior: "smooth"});
        scrapeHighlights(bookSectionsList[chunkNum]);
        if (chunkNum++ < (numberOfChunks-1)){
          setTimeout(go, 100);
        } else {
          showButtons();
        }
      }
      go();
    }

    function showButtons(){
      nameStub = "Scribd.Highlights_"+(highlight.title.split(' ').join('.'));
      jsonFile = JSON.stringify(highlight);

      disp = document.createElement("div");
      disp.setAttribute('class','overlay-text');
      disp.setAttribute('style',`padding: 40px;
                          margin: 0;
                          color: #000;
                       background-color:rgba(255,255,255,1);
                       font-size: 16.5px;
                       position: fixed;
                       top: 0;
                       right: auto;
                       left: auto;
                       width: 90%;
                       z-index: 9999`);
      document.body.appendChild(disp);

      dispTitle = document.createElement("h2");
      dispTitle.innerHTML = highlight.title;
      disp.appendChild(dispTitle);

      e.innerHTML = "Done Loading Highlights";
      document.body.removeChild(e);

      jsonButton = document.createElement("span");
      jsonButton.innerHTML = `<button onclick="download((nameStub+'.json'),jsonFile)">Download JSON File</button>`;
      disp.appendChild(jsonButton);
      textFile = '';
      //create text filename
      for (keys in highlight){
        if (Array.isArray(highlight[keys])){
          //console.log(highlight[keys]);
          textFile += '\n';
          var item = highlight[keys];
          for (var i=0; i<item.length; i++){
            textFile+= item[i].text + '\n';
            textFile+= "LOCATION: "+ item[i].location+'\n\n';

          }
          //console.log('this is an array');
        } else {
          textFile += highlight[keys] + '\n';
        }
      }

      //console.log(textFile);
      textButton = document.createElement("span");
      textButton.innerHTML = `<button onclick="download((nameStub+'.txt'),textFile)">Download Text File</button>`;
      disp.appendChild(textButton);

      closeButton = document.createElement("div");
      closeButton.innerHTML='<button onclick="closeAll()">Close All</button>';
      disp.appendChild(closeButton);

      //document.body.removeChild(disp);
    }

    function closeAll(){
      document.body.removeChild(disp);
    }

    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
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
        var len = highlight.highlights.length;
        //console.log(len);
        if (len > 0){
          if (highlightId === highlight.highlights[len-1].id){
            highlight.highlights[len-1].text += nodeText;
          }
          else{
            highlightElem = {
            "id": highlightId,
            "text": nodeText,
            "location": pageNum.split(' ')[1]
            }
            highlight.highlights.push(highlightElem);
          }
        }
        else{
          highlightElem = {
            "id": highlightId,
            "text": nodeText,
            "location": pageNum.split(' ')[1]
          }
          highlight.highlights.push(highlightElem);
        }
      }
    }
  })();
}
