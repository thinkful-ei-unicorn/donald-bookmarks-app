import $ from 'jquery';
import api from './Api';
import './style.css';
import store from './store.js';
import bookmark from './bookmark.js';

const main = function () {

  api.getBookmark()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmark.render();
    });

  bookmark.bindEventListeners();

  bookmark.render()

};

$(main);