const { nanoid } = require('nanoid');
const books = require('./bookshelf');

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBooks = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBooks);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filterBooks = books;

  if (!name) {
    filterBooks = filterBooks.filter((book) => book
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  if (!reading) {
    filterBooks = filterBooks.filter((book) => book.reading === !!Number(reading));
  }
  if (!finished) {
    filterBooks = filterBooks.filter((book) => book.finished === !!Number(finished));
  }
  const response = h.response({
    status: 'success',
    data: {
      books: filterBooks.map((book) => {
        const data = {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
        return data;
      }),
    },

  })
    .code(200);
  return response;
};

const getBooksbyIdHandler = (request, h) => {
  const { idBooks } = request.params;
  const book = books.filter((a) => a.id === idBooks)[0];

  if (!book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
    .code(404);
  return response;
};

const editBooksByIdHandler = (request, h) => {
  const { idBooks } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === idBooks);

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
        .code(400);
      return response;
    }
    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
        .code(400);

      return response;
    }

    const finished = (pageCount === readPage);

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
      .code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
    .code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { idBooks } = request.params;

  const index = books.findIndex((note) => note.id === idBooks);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
      .code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
    .code(404);

  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksbyIdHandler,
  editBooksByIdHandler,
  deleteBookByIdHandler,
};
