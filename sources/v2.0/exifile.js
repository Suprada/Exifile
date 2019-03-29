/* Exifile v2.0 - Free your Scribd highlights from the cloud
 * http://www.oddumbrella.com/exifile
 * Copyright (c) 2016 Suprada Urval <suprada@suprada.com> (http://www.suprada.com)
 * MIT Licensed*/
exifile = (function() {
    const metadat = {
        name: 'exifile',
        version: '2.0',
        tagline: 'Free your Scribd highlights from the cloud',
        description:
            'When you create highlights and notes when reading your Scribd books, there is no way to see them in one page or to download them. This bookmarklet helps you to excise and file those Scribd highlights.  It gives you a single clean page with all your notes and highlights which can be copies, and gives you the option to download it in plain text format or JSON format. The highlights and notes can also be downloaded in plain text or JSON format.',
        keywords: ['scribd', 'note', 'highlight'],
        author: 'Suprada Urval <suprada@suprada.com> (http://www.suprada.com)',
        bugs: {
            email: 'suprada@suprada.com'
        },
        homepage: 'http://www.oddumbrella.com/exifile',
        license: 'MIT'
    };

    const LOGGER_LEVEL = 'debug';
    // info, debug, error
    const e = document.createElement('div');
    const hostName = location.hostname;
    const readPath = location.pathname.split('/')[1];
    let verticalScrolling = false;
    let highlights = {};
    let bookHighlights = {};
    let anns = [];

    const LOGGER = {
        msg: 'logger message',
        verbose: function() {
            if (LOGGER_LEVEL === 'verbose') {
                console.log(this.msg);
            }
        },
        debug: function() {
            if (LOGGER_LEVEL === 'debug') {
                console.log(this.msg);
            }
        },
        info: function() {
            if (LOGGER_LEVEL === 'info') {
                console.log(this.msg);
            }
        }
    };

    initExifile();

    const closeModal = () => {
        LOGGER.verbose.call({ msg: 'in close modal' });
        const closeBtn =
            document.getElementsByClassName('icon-ic_close') && document.getElementsByClassName('icon-ic_close_small');
        if (closeBtn.length > 0) {
            ('in closing');
            closeBtn[0].click();
        }
    };
    const goToCoverPage = () => {
        LOGGER.verbose.call({ msg: 'in goToCoverPage' });

        /******* Go to Table of Contents and go to the first page of the book *********/
        const tocIcon = document.getElementsByClassName('icon-ic_toc_list');
        tocIcon[0].click();
        const tocParentDiv = tocIcon[0].parentElement.parentElement;
        const tocList = tocParentDiv.querySelector('ul');
        // go to the first item in the menu
        tocList.children[0].click();
    };

    // Functions to do the stuff
    function getLastPage(annotations) {
        LOGGER.verbose.call({
            msg: 'in getLastPage'
        });
        let pageNums = [];
        pageNums = annotations.map(item => item.location.split(' ')[1]);
        return pageNums.reduce((a, b) => (a >= b ? a : b), 0);
    }

    function createTextFile(highlights) {
        textFile = '';
        displayText = '';
        //From quotes object
        displayText += '<ol class="all-quotes">';

        highlights.forEach(item => {
            textFile += '\n';
            displayText += '<li class="quote-style">';
            console.log(item);
            if (item.type === 'highlight') {
                displayText += '<span class="text">' + item.excerpt + '</span>';
                textFile += item.excerpt + '\n';
            } else if (item.type === 'note') {
                textFile += 'NOTE: ' + item.excerpt + '\n';
                displayText += '<br><span class="note">Note: ' + item.excerpt + '</span>';
            }
            textFile += 'LOCATION: ' + item.location + '\n';
            displayText += '<br><span class="page-number">' + item.location + '</span>';
            displayText += '</li>';
        });
        displayText += '</ol>';
        return { textFile: textFile, displayText: displayText };
    }

    function showButtons(e, highlights) {
        nameStub = 'Scribd.Highlights_' + highlights.title.split(' ').join('.');
        jsonFile = JSON.stringify(highlights);

        overlay = document.createElement('main');
        overlay.setAttribute('class', 'overlay-results');

        //remove old div
        e.innerHTML = 'Done Loading Highlights';
        document.body.removeChild(e);
        //add new ovelay div
        document.body.appendChild(overlay);

        //div for the titles
        overlayHeaderDiv = document.createElement('header');
        overlayHeaderDiv.setAttribute('class', 'header-style');
        /*overlayHeaderDiv.setAttribute("style",`display: inline-block;
                          width: 75%;`);*/
        overlay.appendChild(overlayHeaderDiv);

        //div for the download buttons
        overlayButtons = document.createElement('div');
        overlayButtons.setAttribute('class', 'buttons-header');

        overlay.appendChild(overlayButtons);

        overlayTitle = document.createElement('h2');
        overlayTitle.innerHTML = highlights.title;
        overlayHeaderDiv.appendChild(overlayTitle);

        overlayAuthor = document.createElement('h4');
        overlayAuthor.innerHTML = highlights.authors;
        overlayHeaderDiv.appendChild(overlayAuthor);

        overlayISBN = document.createElement('h4');
        overlayISBN.innerHTML = 'ISBN: ' + highlights.isbn;
        /*overlayISBN.style["padding-bottom"] = '20px';*/
        overlayHeaderDiv.appendChild(overlayISBN);

        jsonButton = document.createElement('span');
        jsonButton.innerHTML =
            '<button class="button-style" onclick="download((nameStub+\'.json\'),jsonFile)">Download JSON</button>';
        overlayButtons.appendChild(jsonButton);

        //create text filename and dom list

        obj = createTextFile(highlights.annotations);
        textFile = obj.textFile;
        displayText = obj.displayText;

        textButton = document.createElement('span');
        textButton.innerHTML =
            '<button style="padding: 10px; margin: 10px;" onclick="download((nameStub+\'.txt\'),textFile)">Download Text</button>';
        overlayButtons.appendChild(textButton);

        closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'close-button');
        closeButton.innerHTML =
            '<button onclick="closeAll(overlay)" style="color: #000;background-color:  #fff;"">X</button>';

        overlay.appendChild(closeButton);

        divText = document.createElement('div');
        divText.setAttribute('class', 'highlights-text');

        divText.innerHTML = displayText;
        overlay.appendChild(divText);
        footer = document.createElement('div');
        footer.setAttribute('class', 'exifile-footer');
        footer.innerHTML = '<p>Exifile by Suprada | Free your Scribd highlights</p>';
        overlay.appendChild(footer);
    }

    function scrapeHighlights() {
        // console.log('in scrapeHighlights');
        let pageHighlights = {};
        const elems = document.getElementsByClassName('highlight');
        if (elems.length > 0) {
            for (let el of elems) {
                const id = el.className.split(':')[1];
                if (pageHighlights[id]) {
                    pageHighlights[id].text.push(el.innerHTML);
                } else {
                    pageHighlights[id] = { id: id, text: [el.innerHTML] };
                }
                // console.log(id, el.innerHTML);
            }
            // console.log('returning', pageHighlights);
            return pageHighlights;
        }
        return null;
    }

    function scrollDownPage() {
        LOGGER.verbose.call({ msg: 'in scrollDownPage' });
        var buttonsContainer = document.getElementsByClassName('buttons_container');
        buttonsContainer[0].scrollIntoView();
    }

    function scrapeCurrentPage() {
        LOGGER.verbose.call({ msg: 'in scrapeCurrentPagek' });
        scrollDownPage();
        const scrapedHighlights = scrapeHighlights();
        const currentPage = Number(document.getElementById('footer').innerText.split(' ')[1]);
        const t = { scrapedHighlights: scrapedHighlights, currentPage: currentPage };
        return t;
    }

    function readBook(lastPage) {
        LOGGER.verbose.call({ msg: 'in readBook' });
        let currentPage = 0;
        let highlightsObj = {};
        let cntr = 1;
        let nb1 = [];
        let nb2 = [];
        let t = {};

        return new Promise((resolve, reject) => {
            let i = setInterval(function() {
                // console.log('inside the setinterval ', cntr);
                cntr++;
                t = scrapeCurrentPage();
                currentPage = t.currentPage;
                // console.log('t is', t);
                highlightsObj = Object.assign(highlightsObj, t.scrapedHighlights);
                nb1 = document.getElementsByClassName('only_next_btn');
                nb2 = document.getElementsByClassName('load_next_btn');
                if (nb1 && nb1.length > 0) {
                    nb1[0].getElementsByTagName('button')[0].click();
                } else if (nb2 && nb2.length > 0) {
                    nb2[0].click();
                } else {
                    // console.log('clear Interval', nextButton.length)
                    clearInterval(i);
                    resolve(highlightsObj);
                }
                // console.log('currentPage, lastPage', currentPage, lastPage)
                if (currentPage > lastPage) {
                    // console.log('clear Interval', currentPage, lastPage);
                    clearInterval(i);
                    resolve(highlightsObj);
                }
            }, 5000);
        });
    }

    function getNotesAndBookmarks() {
        // console.log('in getNotesAndAnnotations');
        let annotations = [];
        // expand overflow menu
        document.getElementsByClassName('icon-ic_overflowmenu')[0].parentElement.click();
        // click on Notes & Bookmarks
        document.getElementsByClassName('icon-ic_notebook')[0].parentElement.click();
        // get all li elements with class 'annotation
        // console.log('in scraping annotations');
        const items = document.getElementsByClassName('annotation');
        if (items.length > 0) {
            for (let item of items) {
                const location = item.getElementsByClassName('page_num')[0].innerHTML;
                const type = item.getElementsByClassName('annotation_type')[0].innerHTML;
                const time = item.getElementsByClassName('time')[0].innerHTML;
                const excerpt = item.getElementsByClassName('excerpt')[0].innerHTML;
                if (excerpt && excerpt !== '' && excerpt !== 'No preview available') {
                    annotations.push({ location: location, type: type, time: time, excerpt: excerpt });
                }
            }
            closeModal();
            return annotations;
        }
        closeModal();
        console.log('no notes and bookmarks available in this book');
        return null;
    }

    function combineHighlights(val, annotations) {
        // console.log(val, annotations);
        for (let item in val) {
            console.log(val[item]);
            val[item].combinedText = val[item].text.join(' ');
        }
    }

    function initExifile() {
        makeOverlay(e);
        setInitialOverlayMessage(e);
        verticalScrolling = isVerticalScrollingEnabled();
        /******* Enable vertical scrolling is true. Proceed *********/
        if (verticalScrolling) {
            let p1 = new Promise((resolve, reject) => {
                highlights = getBookMeta(highlights);
                // delay for page to load completely
                delayTimer(() => {
                    resolve(highlights);
                }, 3000);
            });
            p1
                .then(function(val) {
                    // console.log('got highlights', highlights);
                    closeModal();
                    highlights.annotations = getNotesAndBookmarks();
                    if (highlights.annotations) {
                        const lastPage = getLastPage(highlights.annotations);
                        let p2 = new Promise((resolve, reject) => {
                            // console.log('promise to wait for cover page')
                            goToCoverPage();
                            delayTimer(() => {
                                // console.log('in delaytimer');
                                resolve();
                            }, 2000);
                        });
                        p2
                            .then(() => {
                                console.log('in p2 resolve');
                                showButtons(e, highlights);
                                // bookHighlights = readBook(lastPage);
                                // bookHighlights.then(
                                //     (val) => {
                                //         console.log('highlights from promise', val)
                                //         console.log('done reading book', val, highlights);
                                //         debugger;
                                //         combineHighlights(val, highlights);
                                //         showButtons(e, highlights);
                                // }
                                // ).catch(
                                //     (err) => {console.log('bookhighlights promise error')}
                                // )
                            })
                            .catch(err => {
                                console.log('promise p2 failed', error);
                            });
                    } else {
                        LOGGER.info.call({ msg: 'no annotations. close all and go away' });
                    }
                })
                .catch(err => {
                    console.log('promise failed', error);
                });
        } else {
            e.innerHTML =
                '<h3>Vertical scrolling is not enabled.</h3><h3>Exifile will enable vertical scrolling.</h3><h3>Please click on exifile bookmarklet again after page reloads</h3>';
            LOGGER.info.call({
                msg:
                    'vertical scrolling is not enabled. Exifile will enable vertical scrolling. Please click on exifile bookmarklet again after page reloads'
            });
            enableVerticalScrolling();
        }
    }

    // These do something

    function enableVerticalScrolling() {
        LOGGER.verbose.call({ msg: 'in enableVerticalScrolling' });
        // console.log('in enableVerticalScrolling');
        const query = window.location.search;
        window.location.href = window.location.origin + window.location.pathname + '?mode=standard';
    }

    function addCloseButton(e) {
        LOGGER.verbose.call({ msg: 'in addCloseButton' });
        const closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'close-button-e');
        closeButton.innerHTML =
            '<button onclick="document.body.removeChild(document.getElementsByClassName(\'overlay-info\')[0])" style="color: #000;background-color:  #fff;"">X</button>';
        e.appendChild(closeButton);
    }

    function setInitialOverlayMessage(e) {
        LOGGER.verbose.call({ msg: 'in setInitialOverlayMessage' });
        if (hostName !== 'www.scribd.com') {
            e.innerHTML = '<h1>Login to your book at www.scribd.com to start.</h1>';
            addCloseButton(e);
        } else if (hostName === 'www.scribd.com' && readPath !== 'read') {
            e.innerHTML = '<h1>Please start reading book</h1>';
            addCloseButton(e);
        } else if (hostName === 'www.scribd.com' && readPath === 'read') {
            e.innerHTML = '<h1>Downloading</h1>';
        }
    }

    function makeOverlay(e) {
        LOGGER.verbose.call({ msg: 'in makeOverlay' });
        e.setAttribute('class', 'overlay-info');
        document.body.appendChild(e);
    }

    // These calculate and return something

    function isVerticalScrollingEnabled() {
        LOGGER.verbose.call({ msg: 'isVerticalScrollingEnabled' });
        if (document.getElementsByClassName('vertical_reader_container').length > 0) {
            return true;
        }
        return false;
    }

    // Book data parsing helpers

    function getBookMeta(obj) {
        LOGGER.verbose.call({ msg: 'in getBookMeta' });
        // console.log('in getBookMeta');
        obj.title = document.title;
        obj.isbn = document.querySelector('meta[property="books:isbn"]').getAttribute('content');
        /******* get authors info *******/
        // expand overflow menu
        document.getElementsByClassName('icon-ic_overflowmenu')[0].parentElement.click();
        // click on "About Book"
        document.getElementsByClassName('icon-ic_abouttitle')[0].parentElement.click();
        // get all authors
        delayTimer(() => {
            const arrAuthors = document.querySelectorAll('[itemprop="author"] a');
            const authors = [];
            arrAuthors.forEach(function(item) {
                authors.push(item.innerText);
            });
            obj.authors = authors.join(', ');
        }, 1000);
        return obj;
    }

    // overall helpers

    function delayTimer(f, n) {
        return setTimeout(() => {
            f();
        }, n);
    }

    closeAll = function(elem) {
        LOGGER.verbose.call({ msg: 'in closeAll' });
        document.body.removeChild(elem);
    };

    download = function download(filename, text) {
        LOGGER.verbose.call({ msg: 'in download' });
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
})();
