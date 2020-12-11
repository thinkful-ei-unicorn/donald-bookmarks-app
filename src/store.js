const store = {
    bookmarks: [],
    adding: false,
    error: null,
    filter: 0,

};


/* addBookmark function will push/add an object to the 
bookmarks array[] of objects{}
*/

const addBookmark = function (bookmark) {
    this.store.bookmarks.push(bookmark);
};

/*findById will locate the matching id of a bookmark,
return it and store it in a variable. Use .find()
*/

const findById = function (id) {
    let foundBookmark = this.store.bookmarks.find(currentBM => currentBM.id === id);
    return foundBookmark;
};

/*findAndDelete function will find the matching id and delete the 
bookmark object from the array.*/

const findAndDelete = function (id) {
    this.store.bookmarks = this.store.bookmarks.filter(currentBM => currentBM.id !== id);
};

//Filter bookmarks by rating...
const filterByRatings = function () {
    let filteredList = this.store.bookmarks.filter(currentBookmark => currentBookmark.rating >= this.store.filter);
    return filteredList;
};

//sets store filter so it doesn't change
const setFilter = function (rating) {
    this.store.filter = rating
};
export default {
    store,
    addBookmark,
    findById,
    findAndDelete,
    filterByRatings,
    setFilter
};