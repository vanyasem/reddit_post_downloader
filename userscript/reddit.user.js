// ==UserScript==
// @name         Reddit Post Link Copier
// @namespace    reddit_post_downloader
// @version      2024-01-31
// @description  Copy links to Reddit posts
// @author       vanyasem & eric-hamilton
// @homepageURL  https://github.com/vanyasem/reddit_post_downloader
// @supportURL   https://github.com/vanyasem/reddit_post_downloader/issues
// @license      MIT License
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// ==/UserScript==

(function () {
  'use strict';

  function grabRedditLinks(clearClipboard = true) {
    var currentUrl = window.location.href;
    var regex =
      /https?:\/\/(?:(old|www)\.)?reddit\.com\/(r|user)\/([^/]+)\/comments\/([^/]+)\/([^/]+)\/(?!comment\/)/g;

    var links = document.querySelectorAll('a[href*="/comments"]');
    var matchedLinks = new Set();

    links.forEach((link) => {
      var href = link.href;
      var match = regex.exec(href);

      if (match) {
        var linkUrl = match[0].split('?')[0];
        matchedLinks.add(linkUrl);
      }

      if (regex.exec(currentUrl)) {
        matchedLinks.add(currentUrl);
      }
    });

    if (clearClipboard) {
      var uniqueLinksArray = Array.from(matchedLinks);
      navigator.clipboard
        .writeText(uniqueLinksArray.join('\n'))
        .then(() => {
          console.log('Links copied to clipboard!');
          alert(uniqueLinksArray.length + ' links copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy links to clipboard:', error);
          alert('An error occurred while copying links.');
        });
    } else {
      navigator.clipboard
        .readText()
        .then((clipboardContents) => {
          var existingLinks = new Set(clipboardContents.split('\n'));

          matchedLinks.forEach((link) => existingLinks.add(link));

          var updatedClipboardContents = Array.from(existingLinks).join('\n');

          navigator.clipboard
            .writeText(updatedClipboardContents)
            .then(() => {
              console.log(matchedLinks.size + ' links appended to clipboard!');
              if (matchedLinks.size == 25) {
                navigateToNextPage();
              }
            })
            .catch((error) => {
              console.error('Failed to append links to clipboard:', error);
            });
        })
        .catch((error) => {
          console.error('Failed to read clipboard:', error);
        });
    }
  }

  function navigateToNextPage() {
    var elements = document.getElementsByClassName('next-button');
    var nextPageLinkElement = elements[0].firstChild;
    var nextPageLinkUrl = nextPageLinkElement.getAttribute('href', 2);
    window.location.href = nextPageLinkUrl;
  }

  grabRedditLinks(false);
})();
