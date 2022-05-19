const {
  addBooksHandler,
  getAllBooksHandler,
  getBooksbyIdHandler,
  editBooksByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{idBooks}',
    handler: getBooksbyIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{idBooks}',
    handler: editBooksByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{idBooks}',
    handler: deleteBookByIdHandler,
  },
];
module.exports = routes;
