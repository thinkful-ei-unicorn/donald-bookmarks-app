let url = 'https://thinkful-list-api.herokuapp.com/donald/bookmarks'

const bookmarksApiFetch = function (...args) {
    //set up var in scope outside of promise chain
    let error;
    return fetch(...args)
        .then(response => {
            if (!response.ok) {

                error = {
                    code: response.status
                };

                if (!response.headers.get('Content-Type').includes('json')) {
                    error.message = response.statusText;
                    return Promise.reject(error);
                }
            }
            return response.json();
        })
        .then(data => {

            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
};

const getBookmark = function () {
    return bookmarksApiFetch(url, {});
};


const createBookmark = function (bookmark) {
    let newBookmark = JSON.stringify(bookmark);

    return bookmarksApiFetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newBookmark
    });
};

const updateBookmark = function (id, updateData) {
    let newData = JSON.stringify(updateData);

    return bookmarksApiFetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newData
    });
};

const deleteBookmark = function (id) {
    return bookmarksApiFetch(`${url}/${id}`, {
        method: 'Delete'
    });
};

export default {
    getBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark
};