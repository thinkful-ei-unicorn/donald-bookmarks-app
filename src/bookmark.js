import $ from 'jquery';
import store from './store.js';
import api from './Api.js'



const render = function () {
    const myTemplate = generateMain();
    $('main').html(myTemplate)

    if (store.store.adding === true) {
        $('.hidden').show()
    }
    generateError();

    const filteredBMList = store.filterByRatings();

    const bookmarkString = generateBookmarkString(filteredBMList);
    $('.js-bookmark-list').html(bookmarkString);
};

const generateMain = function () {
    let template = `
    <h1>My Bookmarks</h1>
        <div class ="error-container"></div>
 <section>
    <div class ="container">
            <h2>Add a new Bookmark</h2>
            <button type = "button" id ="create-button">Create Bookmark</button><br>
    
    <form id="createBookmark">
        <div class ="hidden">
            <label for ="title">Title:</label><br>
            <input type ="text" id ="title" placeholder ="Title of page" required><br><br>
            <label for = "link">URL Link:</label><br>
            <input type ="text" id="link" minlength = "5" pattern = "https?://.+" placeholder ="http/https format required" required><br><br>
            <label for ="description">Description:</label><br>
            <textarea id ="description" name ="Description" rows="10" cols="30" placeholder="Your description here."></textarea><br><br>
            <label for="rating">Rating:  
        <select name="rating" id="rating" required>
                <option value="" disabled selected>Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
        </select>
            </label><br><br>
            <input type="submit" id="saveBookmark" value="Save Bookmark"><br><br>
        </div>
    </form>
</div>  

<div class="dropdown container">
     <p>Filter Bookmarks By Star rating:</p>
    <form name="filterBM" id="filterBM" action="/action_page.php">
      <select name="starRatings" id="starRatings">
        <option value="" disabled selected>Filter</option>
        <option value="1">1 Star</option>
        <option value="2">2 Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
      </select>
                
        <input type="submit" value="Submit">  
        </form>
</div><br>
   
<div class ="container"><h2>Bookmarks</h2>
    
         <div class ="js-bookmark-list">
         </div>
   
</div>
</section>`

    return template
};
const generateBookmarkElement = function (bookmark) {
    let bookmarkItem =
        `<div class ="container js-bookmark-item" data-item-id="${bookmark.id}" tabindex="0">    
    <div class = "titleInfo">Title: ${bookmark.title}</div>
    <div ${bookmark.expanded === true? '': `style = 'display: none'`}>  
      <ul class = 'bookmark-item-expanded' style='list-style-type:none'>
        <li class = "titleInfo">URL: </li>
        <li class = "bookmarkInfo"><a href="${bookmark.url}" target = "_blank">${bookmark.url}</a></li>
        <li class = "titleInfo">Description: </li>
        <li class = "bookmarkInfo">${bookmark.desc}</li>
      </ul>
    </div>
    <div class = "titleInfo">Rating: ${bookmark.rating} </div><br>
    <div>
    <button type="button" class ="deleteBM">Delete</button>
    <button type="button" class ="bookmark-item-expanded">Details</button></div><br>
    </div>`

    return bookmarkItem;
};

const generateBookmarkString = function (bookmark) {
    let bookmarkList = bookmark.map((list) => generateBookmarkElement(list));

    return bookmarkList.join('');
};

const getBookmarkIdFromElement = function (bookmarkElement) {
    return (
        $(bookmarkElement)
        .closest('.js-bookmark-item')
        .data('item-id')
    );
};

const generateError = function (message) {
    return `<section class="error-content">
        <button id ="cancel-error">x</button>
        <p>${message}</p>
        </section>`;
};

const renderError = function () {
    if (store.error) {
        const el = generateError(store.error);
        $('.error-container').html(el);
    } else {
        $('.error-container').empty();
    }
};

const handleCreateBookmark = function () {
    $('main').on('click', '#create-button', (event) => {
        event.preventDefault();
        store.store.adding = true;

        render();
    });
};

const handleSaveBookmark = function () {
    $('main').on('submit', '#createBookmark', (event) => {
        event.preventDefault();


        let title = $('#title').val();
        let url = $('#link').val();
        let desc = $('#description').val();
        let rating = $('#rating').val();

        let userBookmarkInfo = {
            title,
            url,
            desc,
            rating
        };
        api.createBookmark(userBookmarkInfo)
            .then((bookmarkData) => {
                store.addBookmark(bookmarkData);
                render();
            })
            .catch((error) => {
                store.setError(error.message);
                renderError();
            });


    });
};

const handleFilterBookmark = function () {
    $('main').on('submit', '#filterBM', (event) => {
        event.preventDefault();

        store.setFilter($('#starRatings').val());

        render()
    });
};

const handleDeleteBookmark = function () {
    $('main').on('click', '.deleteBM', (event) => {
        event.preventDefault();
        let bookmarkId = getBookmarkIdFromElement(event.currentTarget);

        api.deleteBookmark(bookmarkId)
            .then(() => {
                store.findAndDelete(bookmarkId)
                render();
            })
            .catch((error) => {
                store.setError(error.message);
                renderError();
            });
    });
};
const handleDetailsButton = function () {
    $('main').on('click', '.bookmark-item-expanded', (event) => {
        event.preventDefault();
        let bookmarkId = getBookmarkIdFromElement($(event.currentTarget));
        let bookmark = store.findById(bookmarkId);

        bookmark.expanded = !bookmark.expanded;

        render()
    });
};

const bindEventListeners = function () {
    handleCreateBookmark();
    handleSaveBookmark();
    handleFilterBookmark();
    handleDeleteBookmark();
    handleDetailsButton();
};




export default {
    render,
    bindEventListeners,
};